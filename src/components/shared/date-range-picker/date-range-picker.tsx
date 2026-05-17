"use client";

import Button from "@/components/ui/button/button";
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
}

const days = ["Min", "Sn", "Sl", "R", "Km", "J", "Sb"];

export default function DateRangePicker({
  value,
  onChange,
  disabledDates,
}: Props): React.ReactNode {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [startDate, setStartDate] = useState<Date | null>(value?.start ?? null);
  const [endDate, setEndDate] = useState<Date | null>(value?.end ?? null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);

  // First disabled date after startDate — check-out cannot go past it
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartDate(value?.start ?? null);
    setEndDate(value?.end ?? null);
  }, [value?.start, value?.end]);

  // 🔥 SELECT LOGIC
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

    onChange?.({
      start: newStart,
      end: newEnd,
    });
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between relative -bottom-11  mb-4">
      <Button
        type="button"
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        variant="ghost"
      >
        <ChevronLeft size={20} />
      </Button>

      <Button
        type="button"
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        variant="ghost"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-3">
      {days.map((day, i) => (
        <div key={i}>{day}</div>
      ))}
    </div>
  );

  const renderCells = (month: Date) => {
    const rows = [];

    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const startDateWeek = startOfWeek(monthStart);
    const endDateWeek = endOfWeek(monthEnd);

    let day = startDateWeek;

    while (day <= endDateWeek) {
      const daysRow = [];

      for (let i = 0; i < 7; i++) {
        const cloneDay = day;

        const isPast = isBefore(cloneDay, today);
        const isUnavailable = disabledDates?.has(format(cloneDay, "yyyy-MM-dd")) ?? false;
        const isCutOff = maxSelectableDate ? !isBefore(cloneDay, maxSelectableDate) : false;
        const isDisabled = isPast || isUnavailable || isCutOff;

        const rangeEnd = endDate ?? hoverDate;

        const inRange =
          startDate &&
          rangeEnd &&
          isAfter(cloneDay, startDate) &&
          isBefore(cloneDay, rangeEnd);

        const isStart = startDate && isSameDay(cloneDay, startDate);
        const isEnd = endDate && isSameDay(cloneDay, endDate);

        daysRow.push(
          <div
            key={cloneDay.toString()}
            onClick={() => !isDisabled && handleSelect(cloneDay)}
            onMouseEnter={() => !isDisabled && setHoverDate(cloneDay)}
            className={clsx(
              "h-12 w-12 my-0.5 flex items-center justify-center relative",
              isDisabled ? "cursor-not-allowed" : "cursor-pointer",
            )}
          >
            {(inRange || isStart || isEnd) && !isDisabled && (
              <div
                className={clsx(
                  "absolute inset-0",
                  inRange && "bg-gray-100",
                  isStart && "bg-gray-100 rounded-l-full",
                  isEnd && "bg-gray-100 rounded-r-full",
                )}
              />
            )}

            <div
              className={clsx(
                "z-10 h-10 w-10 flex items-center justify-center rounded-full text-sm",
                isDisabled && "text-gray-300 line-through",
                !isDisabled && !isSameMonth(cloneDay, monthStart) && "text-gray-300",
                !isDisabled && (isStart || isEnd) && "bg-black text-white",
                !isDisabled && !(isStart || isEnd) && "hover:border hover:border-black",
                isUnavailable && isSameMonth(cloneDay, monthStart) && "bg-red-50",
              )}
            >
              {format(cloneDay, "d")}
            </div>
          </div>,
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {daysRow}
        </div>,
      );
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="w-fit pb-4 z-100 bg-white rounded-2xl m-3 ">
      {renderHeader()}

      <div className="flex gap-6">
        {/* MONTH 1 */}
        <div>
          <div className="text-center font-medium mb-6">
            {format(currentMonth, "MMMM yyyy", { locale: id })}
          </div>
          {renderDays()}
          {renderCells(currentMonth)}
        </div>

        {/* MONTH 2 */}
        <div className="hidden md:block">
          <div className="text-center font-medium mb-6">
            {format(addMonths(currentMonth, 1), "MMMM yyyy")}
          </div>
          {renderDays()}
          {renderCells(addMonths(currentMonth, 1))}
        </div>
      </div>
    </div>
  );
}
