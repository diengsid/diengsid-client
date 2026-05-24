import { z } from "zod/v3";

export const ExperienceImageSchema = z.object({
  id: z.string().optional(),
  experience_id: z.string().optional(),
  image_url: z.string(),
  is_primary: z.boolean().optional(),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  address: z.string(),
  base_price: z.number(),
  description: z.string(),
  experience_type: z.string(),
  lat: z.number(),
  lng: z.number(),
  thumbnail_url: z.string(),
  title: z.string(),
  images: z.array(ExperienceImageSchema),
  created_at: z.number(),
  updated_at: z.number(),
});

export const SearchExperirenceRequestSchema = z.object({
  key: z.string().optional(),
  type: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;
export type ExperienceImage = z.infer<typeof ExperienceImageSchema>;
export type SearchExperirenceRequest = z.infer<
  typeof SearchExperirenceRequestSchema
>;
