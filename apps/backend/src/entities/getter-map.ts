import { AnyEntityName, CommonEntity, EntityFromName } from "@repo/entities";
import { eexGetter } from "./getters/eex.js";
import { epexGetter } from "./getters/epex.js";
import { z } from "zod";

type Getter<TEntityName extends AnyEntityName> = (
  entityFilter: z.infer<EntityFromName<TEntityName>["filter"]>,
) => Promise<CommonEntity[]>;

type EntitiesGetterMap = {
  [TEntityName in AnyEntityName]: Getter<TEntityName>;
};

const entitiesGetterMap: EntitiesGetterMap = {
  eex: eexGetter,
  epex: epexGetter,
};

export const getEntityGetter = <TName extends AnyEntityName>(
  entityName: TName,
): Getter<TName> => entitiesGetterMap[entityName];
