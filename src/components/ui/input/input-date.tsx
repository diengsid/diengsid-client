import { useState } from "react";
import DatePicker from "../date-picker/date-picker";
import Input from "./input";

interface Props {
  label?: string;
  value?: Date;
  onChange?: (val: Date) => void;
}

export default function InputDate({ label = "Date", value, onChange }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  return (
    <div className="">
      <Input
        label={label}
        value={formatDate(value)}
        onFocus={() => setOpen(true)}
        readOnly
      />

      {open && (
        <div
          className="fixed bg-black/30 w-full flex item-center justify-center h-screen left-0 top-0 z-50"
          onClick={() => setOpen(false)}
        >
          <div className="w-full flex items-center justify-center">
            <DatePicker
              classname="shadow-xl"
              value={value}
              onChange={(date: Date) => {
                onChange?.(date);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
