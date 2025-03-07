import {
  EntityName,
  ExtractEntityConfigMapping,
  MarketData,
} from "@repo/entities";
import { eexGetter } from "./getters/eex.js";
import { epexGetter } from "./getters/epex.js";
import { z } from "zod";

type Getter<TEntityName extends EntityName> = (
  filterValue: z.infer<ExtractEntityConfigMapping<TEntityName>["filterSchema"]>,
) => Promise<MarketData[]>;

type EntitiesGetterMap = {
  [TEntityName in EntityName]: Getter<TEntityName>;
};

const entitiesGetterMap: EntitiesGetterMap = {
  eex: eexGetter,
  epex: epexGetter,
};

export const getEntityGetter = <TName extends EntityName>(
  entityName: TName,
): Getter<TName> => entitiesGetterMap[entityName];
