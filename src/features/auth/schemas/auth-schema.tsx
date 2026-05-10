import z from "zod/v3";

export const AuthSchema = z.object({
  token: z.string(),
});

export const AuthWithGoogleSchema = z.object({
  token: z.string(),
});

export type AuthGoogle = z.infer<typeof AuthWithGoogleSchema>;
export type Auth = z.infer<typeof AuthSchema>;
