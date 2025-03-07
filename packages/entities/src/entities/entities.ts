import {
  eexTradeFilterSchema,
  epexAggFilterSchema,
} from "../schemas/entity-filters.js";
import { createEntityFilterSchemaMapping } from "./factory.js";

const eexTradesEntity = createEntityFilterSchemaMapping(
  "eex",
  eexTradeFilterSchema,
);

const epexContinousEntity = createEntityFilterSchemaMapping(
  "epex",
  epexAggFilterSchema,
);

export const CONFIGS = [eexTradesEntity, epexContinousEntity] as const;
