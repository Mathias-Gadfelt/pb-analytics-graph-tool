import z from "zod";
import { EntityId } from "../entities/types.js";

export const intervalType = z.enum(["m", "h", "d", "w", "mo", "q", "y"]);
export type IntervalType = z.infer<typeof intervalType>;

export const marketDataSchema = z.object({
  open: z.number(),
  close: z.number(),
  high: z.number(),
  low: z.number(),
  vwap: z.number(),
  timestampUTC: z.string(),
  intervalType: intervalType,
  interval: z.number(),
});
export type MarketData = z.infer<typeof marketDataSchema>;
export type MarketDataMapping = Record<EntityId, MarketData[]>;
