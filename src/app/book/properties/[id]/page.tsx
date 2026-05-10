import Button from "@/components/ui/button/button";
import { parseLocalDate } from "@/lib/date";
import { X } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    check_in?: string;
    check_out?: string;
  }>;
};

export default async function BookingProperties({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { check_in, check_out } = await searchParams;
  const checkInDate = parseLocalDate(check_in);
  const checkOutDate = parseLocalDate(check_out);

  return (
    <section>
      <div className="w-full flex justify-end p-3">
        <Button asChild variant="ghost">
          <Link
            href={`/properties/${id}?check_in=${checkInDate}&check_out=${checkOutDate}`}
          >
            <X />
          </Link>
        </Button>
      </div>
    </section>
  );
}
