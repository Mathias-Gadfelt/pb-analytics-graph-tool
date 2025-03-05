import z from "zod";
import { getAllEntityNames, getEntity, isEntityId } from "../entities/utils.js";

const entitySchemas = getAllEntityNames().map((name) => {
  const entity = getEntity(name);
  return z.object({
    id: z.string().refine((id) => isEntityId(id, name)),
    filter: entity.filter,
  });
});

export const entityUnionSchema = z.union(
  entitySchemas as [
    (typeof entitySchemas)[number],
    (typeof entitySchemas)[number],
    ...(typeof entitySchemas)[number][],
  ],
);

export type EntityUnion = z.infer<typeof entityUnionSchema>;
