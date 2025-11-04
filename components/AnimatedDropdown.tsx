"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface AnimatedDropdownProps {
  label: string;
  value: string | null;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  onSelect: (value: string) => void;
  onBlur?: () => void;
  variant?: "default" | "compact";
}

export function AnimatedDropdown({
  label,
  value,
  placeholder,
  options,
  error,
  onSelect,
  onBlur,
  variant = "default",
}: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onBlur]);

  const paddingClass = variant === "compact" ? "px-3 py-2" : "px-4 py-2.5";
  const textSizeClass = variant === "compact" ? "text-sm" : "text-base";

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-foreground mb-2">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onBlur={onBlur}
          className={`
            w-full ${paddingClass} border rounded-lg text-left bg-white dark:bg-slate-700 
            text-foreground transition-all duration-200 flex items-center justify-between cursor-pointer
            ${error 
              ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
              : "border-border dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }
          `}
        >
          <span className={`flex items-center gap-2 ${textSizeClass} ${selectedOption ? "text-foreground" : "text-gray-500 dark:text-gray-400"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`
            absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 rounded-lg 
            border border-border dark:border-slate-600 shadow-lg z-50 overflow-hidden
            transition-all duration-200 ease-out
            ${isOpen 
              ? "opacity-100 translate-y-0 pointer-events-auto max-h-[300px] overflow-y-auto scrollbar-hide" 
              : "opacity-0 -translate-y-2 pointer-events-none max-h-0"
            }
          `}
        >
          {options?.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(option?.value || '');
                setIsOpen(false);
              }}
              className={`
                w-full ${paddingClass} text-left transition-colors duration-150 flex items-center gap-3 cursor-pointer
                ${value === option?.value
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300"
                }
                ${textSizeClass}
              `}
            >
              <span className="font-medium">{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}

