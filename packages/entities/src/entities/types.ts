import { z } from "zod";
import { AnyFilterSchema } from "../schemas/entity-filters.js";
import { ENTITIES } from "./entities.js";

export type Entity<TName extends string, TFilter extends AnyFilterSchema> = {
  name: TName;
  filter: TFilter;
};

export type AnyEntityName = (typeof ENTITIES)[number]["name"];
export type EntityFromName<TName extends AnyEntityName> = Extract<
  (typeof ENTITIES)[number],
  { name: TName }
>;
export type EntityWithInferedSchema<TName extends AnyEntityName> = Omit<
  EntityFromName<TName>,
  "filter"
> & {
  filter: z.infer<EntityFromName<TName>["filter"]>;
};

export type EntityId<
  TName extends AnyEntityName = AnyEntityName,
  TNumber extends number = number,
> = `${TName}-${TNumber}`;
export type EntityIdToName<T extends string> =
  T extends `${infer TName}-${number}` ? TName : never;
