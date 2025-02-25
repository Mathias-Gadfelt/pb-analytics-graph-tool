import z from "zod";

export const commonEntity = z.object({
  marketArea: z.string(),
  product: z.string(),
  open: z.number(),
  close: z.number(),
  high: z.number(),
  low: z.number(),
  timestampUtc: z.coerce.date(),
});
export type CommonEntity = z.infer<typeof commonEntity>;
