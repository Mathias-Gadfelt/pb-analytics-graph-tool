import {
  AnyEntityFilter,
  AnyEntityFilterSchema,
} from "../schemas/entity-filters.js";
import { CONFIGS } from "./entities.js";
import { EntityValuesMappingUnion } from "../schemas/entity-mapping.js";

export type EntityConfigMapping<
  TName extends string,
  TFilterSchema extends AnyEntityFilterSchema,
> = {
  name: TName;
  filterSchema: TFilterSchema;
};

export type ExtractEntityConfigMapping<TName extends EntityName> = Extract<
  (typeof CONFIGS)[number],
  { name: TName }
>;

export type ExtractEntityValuesMapping<T extends EntityName | EntityId> =
  Extract<
    EntityValuesMappingUnion,
    { id: `${T extends EntityName ? EntityId<EntityName, number> : string}` }
  >;

export type EntityName = (typeof CONFIGS)[number]["name"];

export type EntityId<
  TName extends EntityName = EntityName,
  TNumber extends number = number,
> = `${TName}-${TNumber}`;

export type EntityIdToName<T extends string> =
  T extends `${infer TName}-${number}` ? TName : never;

export type EntityValuesMapping<
  TEntityId extends EntityId,
  TFilter extends AnyEntityFilter,
> = {
  id: TEntityId;
  filterValues: TFilter;
};
