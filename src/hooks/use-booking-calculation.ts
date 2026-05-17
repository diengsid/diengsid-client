// hooks/useBookingCalculation.ts

import { DateRange } from "@/components/shared/date-range-picker/date-range-picker";
import { Rentable } from "@/features/properties/schemas/schema-property";
import { differenceInCalendarDays } from "date-fns";
import { useMemo } from "react";

interface UseBookingCalculationProps {
  dateRange: DateRange;
  rentable: Rentable | undefined;
}

export function useBookingCalculation({
  dateRange,
  rentable,
}: UseBookingCalculationProps) {
  const totalDays = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return 0;
    return differenceInCalendarDays(dateRange.end, dateRange.start);
  }, [dateRange.start, dateRange.end]);

  const basePrice = rentable?.base_price ?? 0;
  const discountPercent = rentable?.discount ?? 0;

  const totalPrice = useMemo(() => {
    return totalDays * basePrice;
  }, [totalDays, basePrice]);

  const totalDiscount = useMemo(() => {
    return totalPrice * (discountPercent / 100);
  }, [totalPrice, discountPercent]);

  const finalPrice = useMemo(() => {
    return totalPrice - totalDiscount;
  }, [totalPrice, totalDiscount]);

  const pricePerNight = useMemo(() => {
    if (totalDays === 0) return 0;
    return finalPrice / totalDays;
  }, [finalPrice, totalDays]);

  const hasDiscount = discountPercent > 0;
  const hasValidRange = totalDays > 0;
  const hasRentable = !!rentable;
  const isReady = hasValidRange && hasRentable;

  return {
    // Days
    totalDays,

    // Prices
    basePrice,
    totalPrice,
    totalDiscount,
    finalPrice,
    pricePerNight,

    // Discount
    discountPercent,
    hasDiscount,

    // State flags
    hasValidRange,
    hasRentable,
    isReady,
  };
}
