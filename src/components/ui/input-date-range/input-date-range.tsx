import DateRangePicker, {
  DateRange,
} from "@/components/shared/date-range-picker/date-range-picker";
import { format } from "date-fns";
import { useState } from "react";
import Input from "../input/input";

interface Props {
  value?: DateRange;
  labelStart?: string;
  labelEnd?: string;
  onChange?: (date: DateRange) => void;
  className?: string;
  disabledDates?: Set<string>;
}

export default function InputDateRange({
  value,
  labelStart,
  labelEnd,
  onChange,
  className,
  disabledDates,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const formatDate = (date?: Date | null) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy"); // atau "dd MMM yyyy"
  };

  return (
    <div className="w-full max-w-md relative">
      {/* INPUT */}

      <div className="w-full flex gap-x-2 relative z-50">
        <Input
          label={labelStart ?? "Start"}
          value={formatDate(value?.start)}
          onClick={() => setOpen((prev) => !prev)}
          readOnly
          className="cursor-pointer"
        />
        <Input
          label={labelEnd ?? "End"}
          value={formatDate(value?.end)}
          onClick={() => setOpen((prev) => !prev)}
          readOnly
          className="cursor-pointer"
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className={`absolute z-2 rounded-2xl px-3 mt-2 shadow-custom-lg bg-white  right-0 min-w-[750] ${className}`}
        >
          <DateRangePicker
            value={value}
            disabledDates={disabledDates}
            onChange={(date: DateRange) => {
              onChange?.(date);

              // hanya close kalau start & end sudah dipilih
              if (date.start && date.end) {
                setOpen(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
