import z from "zod";
import { AnyFilterSchema } from "../schemas/entity-inputs";
import { Entity } from "./types";
import { CommonEntity } from "../schemas/common-entity";
import { globalFilterSchema } from "../schemas/global-inputs";

export function createEntity<
  TName extends string,
  TFilter extends AnyFilterSchema,
>(
  name: TName,
  filter: TFilter,
  get: (
    entityFilter: z.infer<TFilter>,
    globalFilter: z.infer<typeof globalFilterSchema>,
  ) => Promise<CommonEntity[]>,
): Entity<TName, TFilter> {
  return {
    name,
    filter,
    get,
  };
}
