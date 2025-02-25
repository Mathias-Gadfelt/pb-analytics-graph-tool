import z from "zod";

export const globalFilterSchema = z.object({
  fromUtc: z.coerce.date(),
  toUtc: z.coerce.date(),
  intervalType: z.enum(["day", "hour", "minute", "week", "month", "year"]),
});

export type GlobalFilter = z.infer<typeof globalFilterSchema>;
