import { z } from "zod";

export const ChangeProfileSettingsSchema = z.object({
  name: z.string().min(3),
  darkMode: z.boolean(),
  language: z.enum(["en", "pt_br"]),
});

export type ChangeProfileSettingsSchemaType = z.infer<
  typeof ChangeProfileSettingsSchema
>;
