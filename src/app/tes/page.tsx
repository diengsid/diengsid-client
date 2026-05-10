"use client";
import { DateRange } from "@/components/shared/date-range-picker/date-range-picker";
import InputDateRange from "@/components/ui/input-date-range/input-date-range";
import InputDate from "@/components/ui/input-date/input-date";
import React, { useState } from "react";

export default function TesPage(): React.ReactNode {
  const [date, setDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange>();
  return (
    <div className="flex flex-col gap-4 w-full h-screen bg-white items-center justify-center">
      <InputDate value={date} onChange={setDate} />
      <InputDateRange value={dateRange} onChange={setDateRange} />
    </div>
  );
}
