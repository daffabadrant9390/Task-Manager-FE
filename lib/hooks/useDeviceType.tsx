'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Device } from '../types/device';

export enum DEVICE_TYPE {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
}

export type UseDeviceType = {
  deviceType: Device;
  isDesktop: boolean;
  isMobile: boolean;
  viewportWidth: Nullish<number>;
};

export const DESKTOP_MIN_INNER_WIDTH = 840; // Standard screen size for desktop screen

const DEFAULT_VALUE_DEVICE_TYPE_DATA: UseDeviceType = {
  deviceType: DEVICE_TYPE.DESKTOP,
  isDesktop: true,
  isMobile: false,
  viewportWidth: undefined,
};

const generateClientDeviceType = (screenWidth: number) => {
  return screenWidth >= DESKTOP_MIN_INNER_WIDTH ? DEVICE_TYPE.DESKTOP : DEVICE_TYPE.MOBILE;
};

const DeviceTypeContext = createContext<UseDeviceType>(DEFAULT_VALUE_DEVICE_TYPE_DATA);

export const DeviceTypeContextProvider = ({
  children,
  isDesktop: initialIsDesktop,
}: {
  children: React.ReactNode;
  isDesktop?: boolean;
}) => {
  const [deviceTypeDataState, setDeviceTypeDataState] = useState<UseDeviceType>(() => {
    // Initialize based on prop or detect from window
    if (initialIsDesktop !== undefined) {
      return initialIsDesktop
        ? {
            deviceType: DEVICE_TYPE.DESKTOP,
            isMobile: false,
            isDesktop: true,
            viewportWidth: undefined,
          }
        : {
            deviceType: DEVICE_TYPE.MOBILE,
            isMobile: true,
            isDesktop: false,
            viewportWidth: undefined,
          };
    }
    // Try to detect from window if available (client-side)
    if (typeof window !== 'undefined') {
      const currentWidth = document.documentElement.clientWidth || DESKTOP_MIN_INNER_WIDTH;
      const clientDeviceType = generateClientDeviceType(currentWidth);
      return clientDeviceType === DEVICE_TYPE.DESKTOP
        ? {
            deviceType: DEVICE_TYPE.DESKTOP,
            isDesktop: true,
            isMobile: false,
            viewportWidth: currentWidth,
          }
        : {
            deviceType: DEVICE_TYPE.MOBILE,
            isDesktop: false,
            isMobile: true,
            viewportWidth: currentWidth,
          };
    }
    // Default to desktop if we can't determine (SSR)
    return DEFAULT_VALUE_DEVICE_TYPE_DATA;
  });

  const handleResize = useCallback(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') return;

    const currentWidth = document.documentElement.clientWidth || DESKTOP_MIN_INNER_WIDTH;

    const clientDeviceType = generateClientDeviceType(currentWidth);

    setDeviceTypeDataState(
      clientDeviceType === DEVICE_TYPE.DESKTOP
        ? {
            deviceType: DEVICE_TYPE.DESKTOP,
            isDesktop: true,
            isMobile: false,
            viewportWidth: currentWidth,
          }
        : {
            deviceType: DEVICE_TYPE.MOBILE,
            isDesktop: false,
            isMobile: true,
            viewportWidth: currentWidth,
          },
    );
  }, []);

  // Listen to resize events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <DeviceTypeContext.Provider value={deviceTypeDataState as UseDeviceType}>
      {children}
    </DeviceTypeContext.Provider>
  );
};

export const useDeviceType = () => {
  const deviceTypeData = useContext(DeviceTypeContext);

  return deviceTypeData;
};
