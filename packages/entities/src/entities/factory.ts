import { AnyFilterSchema } from "../schemas/entity-filters.js";
import { Entity } from "./types.js";

export function createEntity<
  TName extends string,
  TFilter extends AnyFilterSchema,
>(name: TName, filter: TFilter): Entity<TName, TFilter> {
  return {
    name,
    filter,
  };
}
