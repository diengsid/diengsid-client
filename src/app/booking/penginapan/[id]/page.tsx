import BookProperty from "@/features/book/components/book-property";
import { parseLocalDate } from "@/lib/date";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    start_date?: string;
    end_date?: string;
    rentable_id?: string;
  }>;
};

export default async function BookingProperties({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { start_date, end_date, rentable_id } = await searchParams;
  const checkInDate = parseLocalDate(start_date);
  const checkOutDate = parseLocalDate(end_date);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return (
    <BookProperty
      token={token ?? ""}
      propertyId={id}
      dateRange={{ start: checkInDate, end: checkOutDate }}
      rentableId={rentable_id}
    />
  );
}
