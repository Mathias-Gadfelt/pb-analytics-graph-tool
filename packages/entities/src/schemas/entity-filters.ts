import z from "zod";
import { intervalType } from "./common-entity.js";

const timeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  intervalType: intervalType,
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

export const epexAggFilterSchema = z.object({
  marketArea: z.string().optional(),
  product: z.string().optional(),
  ...timeSchema.shape,
});
export type EpexContinousAggFilter = z.infer<typeof epexAggFilterSchema>;

export type AnyEntityFilterSchema =
  | typeof eexTradeFilterSchema
  | typeof epexAggFilterSchema;

export type AnyEntityFilter =
  | z.infer<typeof eexTradeFilterSchema>
  | z.infer<typeof epexAggFilterSchema>;
