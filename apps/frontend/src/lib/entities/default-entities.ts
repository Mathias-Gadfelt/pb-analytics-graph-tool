import { AnyEntityName, EntityFromName } from "@repo/entities";
import { z } from "zod";

type EntitiesDefaultMap = {
  [TEntityName in AnyEntityName]: z.infer<
    EntityFromName<TEntityName>["filter"]
  >;
};

const defaultTimeObject = {
  from: new Date(new Date().setMonth(new Date().getMonth() - 1)), //A month ago
  to: new Date(), //Now
  interval: 1,
  intervalType: "h",
} as const;

const entitiesDefaultMap: EntitiesDefaultMap = {
  eex: {
    ...defaultTimeObject,
  },
  epex: {
    ...defaultTimeObject,
    deliveryMonth: 202101,
  },
};

export const getDefaultEntity = <TName extends AnyEntityName>(
  entityName: TName,
): EntitiesDefaultMap[TName] => entitiesDefaultMap[entityName];
