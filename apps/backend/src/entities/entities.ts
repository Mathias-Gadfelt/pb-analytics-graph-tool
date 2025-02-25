import {
  eexTradeFilterSchema,
  epexContinousFilterSchema,
} from "../schemas/entity-inputs";
import { createEntity } from "./factory";
import { eexGetter } from "./getters/eex";
import { epexGetter } from "./getters/epex";

const eexTradesEntity = createEntity("eex", eexTradeFilterSchema, eexGetter);

const epexContinousEntity = createEntity(
  "epex",
  epexContinousFilterSchema,
  epexGetter,
);

const ENTITIES = [eexTradesEntity, epexContinousEntity] as const;

export default ENTITIES;
