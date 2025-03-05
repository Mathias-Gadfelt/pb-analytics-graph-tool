import z from "zod";

const timeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  intervalType: z.enum(["m", "h", "d", "w", "mo", "q", "y"]),
  interval: z.number(),
});

//TODO: Make it so the delivery_periods are automatically fetched from db?
export const eexTradeFilterSchema = z.object({
  marketArea: z.string().optional(),
  productCode: z.string().optional(),
  deliveryPeriod: z
    .enum(["YEAR", "QUARTER", "SEASON", "MONTH", "WEEK", "WEEKEND", "DAY"])
    .optional(),
  ...timeSchema.shape,
});
export type EexTradeFilter = z.infer<typeof eexTradeFilterSchema>;

export const epexContinousFilterSchema = z.object({
  marketArea: z.string().optional(),
  product: z.string().optional(),
  deliveryMonth: z.number(),
  ...timeSchema.shape,
});
export type EpexContinousAggFilter = z.infer<typeof epexContinousFilterSchema>;

export type AnyFilterSchema =
  | typeof eexTradeFilterSchema
  | typeof epexContinousFilterSchema;
