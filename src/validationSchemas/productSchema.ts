import * as z from "zod";

export const productFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1, "Name is required").max(255),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price is required",
    })
    .min(1, { message: "Price must be greater than 0" })
    .max(1000, {
      message: "Price must be less than 1000",
    }),
  categoryId: z.number({
    required_error: "Category is required",
  }),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
