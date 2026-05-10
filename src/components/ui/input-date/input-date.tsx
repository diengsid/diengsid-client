"use client";
import DatePicker from "@/components/shared/date-picker/date-picker";
import { format } from "date-fns";
import { useState } from "react";
import Input from "../input/input";

interface Props {
  value?: Date;
  onChange?: (date: Date) => void;
}

export default function InputDate({ value, onChange }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy"); // atau "dd MMM yyyy"
  };

  return (
    <div className="w-full max-w-md relative z-50">
      {/* INPUT */}

      <Input
        label="Tanggal"
        value={formatDate(value)}
        onClick={() => setOpen((prev) => !prev)}
        readOnly
        className="cursor-pointer"
      />

      {/* DROPDOWN */}
      {open && (
        <div className="z-2 absolute rounded-2xl">
          <DatePicker
            value={value}
            onChange={(date: Date) => {
              onChange?.(date);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
