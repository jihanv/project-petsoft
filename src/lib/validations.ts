import { z } from "zod";
import { DEFAULT_PET_IMAGE } from "./constants";
//Validation through Zod

export const petIdSchema = z.string().cuid();

export const petFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, {
        message: "Name is required",
      })
      .max(10, {
        message: "Name should be less than 10 characters",
      }),
    ownerName: z
      .string()
      .trim()
      .min(1, {
        message: "Owner Name is required",
      })
      .max(100, {
        message: "Owner Name should be less than 100 characters",
      }),
    imageUrl: z.union([
      z.literal(""),
      z
        .string()
        .trim()
        .refine((v) => /^https?:\/\//i.test(v) || v.startsWith("/"), {
          message: "Image URL must be http(s) or start with '/'",
        }),
    ]),
    age: z.coerce.number().int().positive().max(50),
    notes: z.union([z.literal(""), z.string().trim().max(1000)]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
  }));

export type TPetFormData = z.infer<typeof petFormSchema>;
