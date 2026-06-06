import Image from "next/image";
import Link from "next/link";

export function Logo({ scrollY }: { scrollY: number }) {
  const isSmall = scrollY > 340;

  return (
    <Link href="/" className="relative h-10 w-37.5 flex items-center">
      <Image
        src="/logo2.png"
        alt="dieng.id"
        width={150}
        height={40}
        priority
        className={`transition-all duration-300 origin-left ${
          isSmall ? "scale-80" : "scale-85"
        }`}
      />
    </Link>
  );
}
