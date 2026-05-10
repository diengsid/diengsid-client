"use client";

import clsx from "clsx";
import { forwardRef, useEffect, useState } from "react";

type Props = {
  label: string;
  prefix?: string;
  error?: string;
  containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      prefix,
      error,
      containerClassName,
      className,
      disabled,
      readOnly,
      value,
      onFocus,
      onBlur,
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
      <div className="space-y-0.5 bg-white w-full">
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
            {/* Prefix */}
            {prefix && isActive && (
              <span className="mr-2 text-gray-500">{prefix}</span>
            )}

            {/* Input */}
            <input
              ref={ref}
              disabled={disabled}
              readOnly={readOnly}
              value={value}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                setHasValue(!!e.target.value); // 🔥 ambil dari DOM
                onBlur?.(e);
              }}
              onChange={(e) => {
                setHasValue(!!e.target.value); // 🔥 ini kunci
                props.onChange?.(e); // tetap forward ke RHF
              }}
              className={clsx(
                "w-full bg-transparent outline-none text-sm",
                "disabled:bg-transparent",
                className,
              )}
              {...props}
            />
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

Input.displayName = "Input";

export default Input;
