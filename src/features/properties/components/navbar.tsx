import Button from "@/components/ui/button/button";
import { ArrowLeft, Heart, Share } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NavbarDetailProperty(): React.ReactNode {
  return (
    <nav className="w-full p-4 flex absolute z-30 justify-between ">
      <Link href="/">
        <Button variant="ghost" className="bg-white/50 rounded-full!">
          <ArrowLeft size={22} />
        </Button>
      </Link>
      <div className="flex gap-2">
        <Button variant="ghost" className="bg-white/50 rounded-full!">
          <Share size={22} />
        </Button>
        <Button variant="ghost" className="bg-white/50 rounded-full!">
          <Heart size={22} />
        </Button>
      </div>
    </nav>
  );
}
