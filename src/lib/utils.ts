import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ScrollOptions = {
  offset?: number;
  behavior?: ScrollBehavior;
};

export function scrollToId(id: string, options: ScrollOptions = {}) {
  if (typeof window === "undefined") return;

  const { offset = -80, behavior = "smooth" } = options;

  const el = document.getElementById(id);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.pageYOffset + offset;

  window.scrollTo({
    top: y,
    behavior,
  });
}
