"use client";

import clsx from "clsx";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface Props {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  disabledDates?: Set<string>;
  singleMonth?: boolean;
}

const DAY_LABELS = ["Min", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"];

export default function DateRangePicker({
  value,
  onChange,
  disabledDates,
  singleMonth = false,
}: Props): React.ReactNode {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(value?.start ?? null);
  const [endDate, setEndDate] = useState<Date | null>(value?.end ?? null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);

  // first disabled date after startDate — check-out cannot go past it
  const maxSelectableDate = useMemo(() => {
    if (!startDate || endDate || !disabledDates?.size) return null;
    let d = addDays(startDate, 1);
    for (let i = 0; i < 365; i++) {
      if (disabledDates.has(format(d, "yyyy-MM-dd"))) return d;
      d = addDays(d, 1);
    }
    return null;
  }, [startDate, endDate, disabledDates]);

  useEffect(() => {
    setStartDate(value?.start ?? null);
    setEndDate(value?.end ?? null);
  }, [value?.start, value?.end]);

  const handleSelect = (day: Date) => {
    let newStart = startDate;
    let newEnd = endDate;

    if (!startDate || (startDate && endDate)) {
      newStart = day;
      newEnd = null;
    } else {
      if (isBefore(day, startDate)) {
        newStart = day;
      } else {
        newEnd = day;
      }
    }

    setStartDate(newStart);
    setEndDate(newEnd);
    onChange?.({ start: newStart, end: newEnd });
  };

  // ── renders one month grid ─────────────────────────────────────────────────

  const renderDayHeaders = () => (
    <div className="grid grid-cols-7">
      {DAY_LABELS.map((d) => (
        <div key={d} className="py-1 text-center text-[11px] font-medium text-zinc-400">
          {d}
        </div>
      ))}
    </div>
  );

  const renderCells = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const gridStart = startOfWeek(monthStart);
    const gridEnd = endOfWeek(monthEnd);

    const rows: React.ReactNode[] = [];
    let day = gridStart;

    while (day <= gridEnd) {
      const cells: React.ReactNode[] = [];

      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isPast = isBefore(cloneDay, today);
        const isUnavailable = disabledDates?.has(format(cloneDay, "yyyy-MM-dd")) ?? false;
        const isCutOff = maxSelectableDate ? !isBefore(cloneDay, maxSelectableDate) : false;
        const isDisabled = isPast || isUnavailable || isCutOff;
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);

        const rangeEnd = endDate ?? hoverDate;
        const inRange =
          startDate &&
          rangeEnd &&
          isAfter(cloneDay, startDate) &&
          isBefore(cloneDay, rangeEnd);
        const isStart = startDate ? isSameDay(cloneDay, startDate) : false;
        const isEnd = endDate ? isSameDay(cloneDay, endDate) : false;

        cells.push(
          <div
            key={cloneDay.toISOString()}
            onClick={() => !isDisabled && handleSelect(cloneDay)}
            onMouseEnter={() => !isDisabled && setHoverDate(cloneDay)}
            onMouseLeave={() => setHoverDate(null)}
            className={clsx(
              "relative flex aspect-square select-none items-center justify-center",
              isDisabled ? "cursor-not-allowed" : "cursor-pointer",
            )}
          >
            {/* range background strip */}
            {(inRange || isStart || isEnd) && !isDisabled && (
              <div
                className={clsx(
                  "absolute inset-y-[15%] inset-x-0",
                  inRange && "bg-zinc-100",
                  isStart && "rounded-l-full bg-zinc-100",
                  isEnd && "rounded-r-full bg-zinc-100",
                )}
              />
            )}

            {/* date circle */}
            <div
              className={clsx(
                "relative z-10 flex h-[78%] w-[78%] items-center justify-center rounded-full text-sm transition-colors",
                !isCurrentMonth && "text-zinc-300",
                isCurrentMonth && isDisabled && "text-zinc-300 line-through",
                isCurrentMonth && !isDisabled && !isStart && !isEnd && "hover:bg-zinc-100",
                isCurrentMonth && !isDisabled && (isStart || isEnd) && "bg-zinc-900 text-white",
                isUnavailable && isCurrentMonth && "bg-red-50",
              )}
            >
              {format(cloneDay, "d")}
            </div>
          </div>,
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7">
          {cells}
        </div>,
      );
    }

    return <div>{rows}</div>;
  };

  // ── month column ───────────────────────────────────────────────────────────

  const navBtn = (onClick: () => void, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
    >
      {icon}
    </button>
  );

  const nextMonth = addMonths(currentMonth, 1);

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full p-4">
      <div className={`grid grid-cols-1 gap-6 ${singleMonth ? "" : "md:grid-cols-2 md:gap-8"}`}>

        {/* month 1 */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            {navBtn(() => setCurrentMonth((m) => subMonths(m, 1)), <ChevronLeft size={16} />)}
            <span className="text-sm font-semibold text-zinc-800">
              {format(currentMonth, "MMMM yyyy", { locale: id })}
            </span>
            {/* on mobile show the next-month arrow here too */}
            <div className="md:hidden">
              {navBtn(() => setCurrentMonth((m) => addMonths(m, 1)), <ChevronRight size={16} />)}
            </div>
            {/* spacer on desktop so title stays centered */}
            <div className="hidden w-8 md:block" />
          </div>
          {renderDayHeaders()}
          {renderCells(currentMonth)}
        </div>

        {/* month 2 — desktop only, hidden when singleMonth */}
        <div className={singleMonth ? "hidden" : "hidden min-w-0 md:block"}>
          <div className="mb-3 flex items-center justify-between">
            <div className="w-8" />
            <span className="text-sm font-semibold text-zinc-800">
              {format(nextMonth, "MMMM yyyy", { locale: id })}
            </span>
            {navBtn(() => setCurrentMonth((m) => addMonths(m, 1)), <ChevronRight size={16} />)}
          </div>
          {renderDayHeaders()}
          {renderCells(nextMonth)}
        </div>

      </div>
    </div>
  );
}
