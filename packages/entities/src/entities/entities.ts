import {
  eexTradeFilterSchema,
  epexContinousFilterSchema,
} from "../schemas/entity-filters.js";
import { createEntity } from "./factory.js";

const eexTradesEntity = createEntity("eex", eexTradeFilterSchema);

const epexContinousEntity = createEntity("epex", epexContinousFilterSchema);

export const ENTITIES = [eexTradesEntity, epexContinousEntity] as const;
