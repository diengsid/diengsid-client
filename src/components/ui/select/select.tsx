"use client";

import clsx from "clsx";
import { ChevronUp } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  label: string;
  options: Option[];
  error?: string;
  containerClassName?: string;
  placeholder?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, Props>(
  (
    {
      label,
      options,
      error,
      containerClassName,
      className,
      disabled,
      value,
      onFocus,
      onBlur,
      placeholder = "Pilih",
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    useEffect(() => {
      setHasValue(!!value);
    }, [value]);

    const isActive = isFocused || hasValue;

    return (
      <div className="space-y-0.5">
        <div className={clsx("relative w-full", containerClassName)}>
          {/* Wrapper */}
          <div
            className={clsx(
              "flex items-center rounded-xl border px-4 pt-6 pb-1.5 transition-all",
              disabled && "bg-gray-100 cursor-not-allowed",
              error
                ? "border-red-500"
                : isFocused
                  ? "border-black"
                  : "border-gray-300",
            )}
          >
            {/* Select */}
            <select
              ref={ref}
              disabled={disabled}
              value={value}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                setHasValue(!!e.target.value);
                onBlur?.(e);
              }}
              onChange={(e) => {
                setHasValue(!!e.target.value);
                props.onChange?.(e);
              }}
              className={clsx(
                "w-full bg-transparent outline-none text-sm appearance-none",
                "disabled:bg-transparent",
                className,
              )}
              {...props}
            >
              {/* Placeholder */}
              <option value="" disabled hidden>
                {placeholder}
              </option>

              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Arrow */}
            <ChevronUp size={18} className={clsx("transition-transform")} />
          </div>

          {/* Label */}
          <label
            className={clsx(
              "pointer-events-none absolute left-4 text-gray-500 transition-all duration-200",
              isActive ? "top-2 text-xs" : "top-1/2 -translate-y-1/2 text-sm",
            )}
          >
            {label}
          </label>
        </div>

        {/* Error */}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
