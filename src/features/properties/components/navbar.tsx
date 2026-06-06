"use client";

import Button from "@/components/ui/button/button";
import { ArrowLeft, Check, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function NavbarDetailProperty(): React.ReactNode {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — do nothing
      }
      return;
    }

    // fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <nav className="w-full p-4 flex absolute z-30 justify-between">
      <Link href="/">
        <Button variant="ghost" className="bg-white/50 rounded-full!">
          <ArrowLeft size={22} />
        </Button>
      </Link>
      <div className="flex gap-2 items-center">
        <div className="relative">
          <Button
            variant="ghost"
            className="bg-white/50 rounded-full! cursor-pointer"
            onClick={handleShare}
          >
            {copied ? (
              <Check size={22} className="text-emerald-600" />
            ) : (
              <Share2 size={22} />
            )}
          </Button>
          {copied && (
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-800 px-2.5 py-1 text-xs text-white shadow-lg">
              Link disalin!
            </span>
          )}
        </div>
        <Button variant="ghost" className="bg-white/50 rounded-full! cursor-pointer">
          <Heart size={22} />
        </Button>
      </div>
    </nav>
  );
}
