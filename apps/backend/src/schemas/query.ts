import z from "zod";
import { globalFilterSchema } from "./global-inputs";
import { getAllEntityNames, getEntity, isEntityId } from "../entities/utils";

const entitySchemas = getAllEntityNames().map((name) => {
  const entity = getEntity(name);
  return z.object({
    id: z.string().refine((id) => isEntityId(id, name)),
    filter: entity.filter,
  });
});

const entitySchemaUnion = z.union(
  entitySchemas as [
    (typeof entitySchemas)[number],
    (typeof entitySchemas)[number],
    ...(typeof entitySchemas)[number][],
  ],
);

export const querySchema = z.object({
  globalFilter: globalFilterSchema,
  entities: z.array(entitySchemaUnion),
});
