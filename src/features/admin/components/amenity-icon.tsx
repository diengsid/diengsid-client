import { cn } from "@/lib/utils";
import {
  type LucideIcon,
  Sparkles,
  Wifi, WifiOff, Signal,
  ParkingCircle, Car, Bus, Bike,
  Waves, Droplets, Bath,
  AirVent, Wind, Snowflake, Thermometer, Sun, Cloud,
  Tv, Tv2, Monitor, Music, Headphones,
  UtensilsCrossed, Utensils, Coffee, ChefHat, Pizza, Apple, Refrigerator, Microwave, CookingPot,
  Dumbbell, PersonStanding, Accessibility, Heart, Activity,
  Shirt, WashingMachine, Scissors,
  Leaf, TreeDeciduous, TreePine, Flower2, Mountain, Palmtree, Flame,
  Shield, Lock, Key, Camera, Cctv, Bell, AlertTriangle,
  ArrowUpDown, Building2, Home, Sofa, Lamp, LampDesk, BedDouble, BedSingle,
  Zap, Plug, Lightbulb,
  PawPrint, Dog, Cat, Bird, Baby,
  Cigarette, Backpack, Briefcase, MapPin, Star,
} from "lucide-react";

export const AMENITY_ICONS: Record<string, LucideIcon> = {
  wifi: Wifi, wifi_off: WifiOff, signal: Signal,
  parking: ParkingCircle, car: Car, bus: Bus, bike: Bike,
  pool: Waves, water: Droplets, bath: Bath,
  ac: AirVent, fan: Wind, heater: Thermometer, snow: Snowflake, sun: Sun, cloud: Cloud,
  tv: Tv, tv2: Tv2, monitor: Monitor, music: Music, headphones: Headphones,
  kitchen: UtensilsCrossed, utensils: Utensils, coffee: Coffee, chef: ChefHat,
  pizza: Pizza, fruit: Apple, fridge: Refrigerator, microwave: Microwave, cooking: CookingPot,
  gym: Dumbbell, walking: PersonStanding, wheelchair: Accessibility, heart: Heart, activity: Activity,
  wardrobe: Shirt, laundry: WashingMachine, scissors: Scissors,
  leaf: Leaf, tree: TreeDeciduous, pine: TreePine, flower: Flower2,
  mountain: Mountain, palm: Palmtree, fire: Flame, bbq: Flame,
  security: Shield, lock: Lock, key: Key, camera: Camera, cctv: Cctv, bell: Bell, alert: AlertTriangle,
  elevator: ArrowUpDown, building: Building2, home: Home, sofa: Sofa,
  lamp: Lamp, desk_lamp: LampDesk, bed_double: BedDouble, bed_single: BedSingle,
  electricity: Zap, plug: Plug, lightbulb: Lightbulb,
  pet: PawPrint, dog: Dog, cat: Cat, bird: Bird, baby: Baby,
  smoking: Cigarette, backpack: Backpack, briefcase: Briefcase, location: MapPin, star: Star,
  other: Sparkles,
};

export const ICON_KEYS = Object.keys(AMENITY_ICONS);

export function AmenityIcon({
  icon,
  size = 18,
  className,
}: {
  icon: string;
  size?: number;
  className?: string;
}) {
  const Icon = AMENITY_ICONS[icon] ?? Sparkles;
  return <Icon size={size} className={cn(className)} />;
}
