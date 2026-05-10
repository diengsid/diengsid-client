import { Footer } from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/navbar/navbar";
import DetailProperty from "@/features/properties/components/detail";
import NavItem from "@/features/properties/components/nav-detail";
import NavbarDetailProperty from "@/features/properties/components/navbar";
import { parseLocalDate } from "@/lib/date";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    check_in?: string;
    check_out?: string;
    rentable_id?: string;
  }>;
};

export default async function DetailPropertyPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { check_in, check_out, rentable_id } = await searchParams;
  const checkInDate = parseLocalDate(check_in);
  const checkOutDate = parseLocalDate(check_out);
  const rentableId = rentable_id || "";

  return (
    <>
      {/* navbar mobile */}
      <div className="md:hidden">
        <NavbarDetailProperty />
      </div>

      {/* navbar desktop */}
      <div className="hidden md:block">
        <Navbar isFixed={false} />
      </div>

      <NavItem totalDays={3} />

      {/* detail section */}
      <DetailProperty
        propertyId={id}
        checkIn={checkInDate}
        checkOut={checkOutDate}
        rentableId={rentableId}
      />
      <Footer />
    </>
  );
}
