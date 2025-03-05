import z from "zod";
import { EntityId } from "../entities/types.js";

export const commonEntity = z.object({
  open: z.number(),
  close: z.number(),
  high: z.number(),
  low: z.number(),
  vwap: z.number(),
  timestampUTC: z.coerce.date(),
});
export type CommonEntity = z.infer<typeof commonEntity>;
export type CommonEntitiesUnion = Record<EntityId, CommonEntity[]>;
