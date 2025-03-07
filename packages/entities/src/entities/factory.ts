import { AnyEntityFilterSchema } from "../schemas/entity-filters.js";
import { EntityConfigMapping } from "./types.js";

export function createEntityFilterSchemaMapping<
  TEntityName extends string,
  TFilterSchema extends AnyEntityFilterSchema,
>(
  name: TEntityName,
  filterSchema: TFilterSchema,
): EntityConfigMapping<TEntityName, TFilterSchema> {
  return {
    name,
    filterSchema,
  };
}
