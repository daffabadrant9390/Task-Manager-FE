import '@testing-library/jest-dom';

// Mock for next/navigation frequently used in app router
jest.mock('next/navigation', () => {
	return {
		useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
		useSearchParams: () => new URLSearchParams(),
		usePathname: () => '/',
	};
});

// Polyfills commonly missing in Jest JSDOM
// TextEncoder for code paths using Web Crypto input encoding
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(global as any).TextEncoder) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { TextEncoder } = require('util');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).TextEncoder = TextEncoder;
}

// BroadcastChannel is not available in JSDOM; provide a no-op polyfill
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(global as any).BroadcastChannel) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).BroadcastChannel = class {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        constructor(_: string) {}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        postMessage(_: unknown) {}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        close() {}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        addEventListener() {}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        removeEventListener() {}
    };
}

// Minimal Web Crypto polyfill for tests that rely on crypto.subtle.digest
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(global as any).crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).crypto = {};
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(global as any).crypto.subtle) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).crypto.subtle = {
        // Return a stable 1-byte ArrayBuffer by default; tests can override
        async digest() {
            return new Uint8Array([0x00]).buffer;
        },
    };
}


