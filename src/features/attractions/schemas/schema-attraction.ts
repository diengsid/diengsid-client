import { z } from "zod/v3";

export const AttractionSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  category: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const NearbyAttractionSchema = z.object({
  tourist_attraction_id: z.string(),
  distance_km: z.number().optional().nullable(),
  duration_minutes: z.number().optional().nullable(),
  sort_order: z.number(),
  attraction: AttractionSchema,
});

export type Attraction = z.infer<typeof AttractionSchema>;
export type NearbyAttraction = z.infer<typeof NearbyAttractionSchema>;
