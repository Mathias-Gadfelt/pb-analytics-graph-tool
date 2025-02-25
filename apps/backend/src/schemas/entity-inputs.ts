import z from "zod";

//TODO: Make it so the delivery_periods are automatically fetched from db?
export const eexTradeFilterSchema = z
  .object({
    marketArea: z.string(),
    productCode: z.string(),
    deliveryPeriod: z.enum([
      "YEAR",
      "QUARTER",
      "SEASON",
      "MONTH",
      "WEEK",
      "WEEKEND",
      "DAY",
    ]),
  })
  .partial();
export type EexTradeFilter = z.infer<typeof eexTradeFilterSchema>;

export const epexContinousFilterSchema = z
  .object({
    marketArea: z.string(),
    product: z.string(),
  })
  .partial();
export type EpexContinousAggFilter = z.infer<typeof epexContinousFilterSchema>;

export type AnyFilterSchema =
  | typeof eexTradeFilterSchema
  | typeof epexContinousFilterSchema;
