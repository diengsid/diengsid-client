import { ExperienceSchema } from "@/features/experiences/schemas/experience-schema";
import { z } from "zod/v3";

export const RentableSchema = z.object({
  id: z.string(),
  property_id: z.string(),
  type: z.string(),
  name: z.string(),
  image_url: z.string(),
  capacity: z.number(),
  base_price: z.number(),
  discount: z.number(),
  stock: z.number(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const HostSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone_number: z.string(),
  profile_picture_url: z.string(),
  address: z.string().optional(),
  bank_account_name: z.string().optional(),
  bank_account_number: z.string().optional(),
  ktp_number: z.string().optional(),
  bio: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const PropertySchema = z.object({
  id: z.string(),
  experience: ExperienceSchema,
  host: HostSchema,
  rentable: z.array(RentableSchema),
  property_type: z.string(),
  booking_type: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export type Property = z.infer<typeof PropertySchema>;
export type Host = z.infer<typeof HostSchema>;
export type Rentable = z.infer<typeof RentableSchema>;
