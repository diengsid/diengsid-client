import { z } from "zod/v3";

export const PropertyImageSchema = z.object({
  id: z.string().optional(),
  property_id: z.string().optional(),
  image_url: z.string(),
  is_primary: z.boolean().optional().default(false),
});

export const AmenitySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional().default(""),
  category: z.string().optional().default(""),
});

export const RentableSchema = z.object({
  id: z.string(),
  property_id: z.string(),
  type: z.string(),
  name: z.string(),
  image_url: z.string().optional().default(""),
  capacity: z.number(),
  base_price: z.number(),
  discount: z.number().optional().default(0),
  stock: z.number(),
  amenities: z.array(AmenitySchema).optional().default([]),
  created_at: z.number(),
  updated_at: z.number(),
});

export const HostSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional().default(""),
  phone_number: z.string().optional().default(""),
  profile_picture_url: z.string().optional().default(""),
  address: z.string().optional(),
  bio: z.string().optional().default(""),
  created_at: z.number().optional(),
  updated_at: z.number().optional(),
});

export const PropertySchema = z.object({
  id: z.string(),
  slug: z.string().optional().default(""),
  property_type: z.string(),
  booking_type: z.string().optional().default(""),
  title: z.string(),
  address: z.string(),
  description: z.string(),
  thumbnail_url: z.string().optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  images: z.array(PropertyImageSchema).optional().default([]),
  host: HostSchema.optional(),
  rentable: z.array(RentableSchema).optional().default([]),
  amenities: z.array(AmenitySchema).optional().default([]),
  created_at: z.number(),
  updated_at: z.number(),
});

export const SearchPropertyRequestSchema = z.object({
  key: z.string().optional(),
  property_type: z.string().optional(),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  guest_count: z.number().optional(),
  attraction_id: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export type Property = z.infer<typeof PropertySchema>;
export type PropertyImage = z.infer<typeof PropertyImageSchema>;
export type Host = z.infer<typeof HostSchema>;
export type Rentable = z.infer<typeof RentableSchema>;
export type Amenity = z.infer<typeof AmenitySchema>;
export type SearchPropertyRequest = z.infer<typeof SearchPropertyRequestSchema>;
