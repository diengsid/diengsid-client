"use client";

import clsx from "clsx";
import type React from "react";

interface Step {
  label: string;
}

interface Props {
  currentStep: number;
  steps: Step[];
}

export default function Stepper({
  currentStep,
  steps,
}: Props): React.ReactNode {
  return (
    <div className="flex items-start justify-between gap-3 overflow-x-auto py-2">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div
            key={step.label}
            className="flex min-w-[72px] flex-1 flex-col items-center gap-2"
          >
            <div
              className={clsx(
                "h-2 w-full rounded-full transition-colors",
                isActive || isCompleted ? "bg-zinc-900" : "bg-zinc-200",
              )}
            />
            <span
              className={clsx(
                "text-center text-xs md:text-sm",
                isActive ? "font-medium text-zinc-950" : "text-zinc-500",
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
