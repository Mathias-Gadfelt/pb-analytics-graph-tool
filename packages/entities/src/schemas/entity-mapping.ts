import z from "zod";
import {
  getAllEntityNames,
  getEntityConfigMapping,
  isEntityId,
} from "../entities/utils.js";

const entityFilterSchemas = getAllEntityNames().map((name) => {
  const entity = getEntityConfigMapping(name);
  return z.object({
    id: z.string().refine((id) => isEntityId(id, name)),
    filter: entity.filterSchema,
  });
});

export const entityConfigMappingUnion = z.union(
  entityFilterSchemas as [
    (typeof entityFilterSchemas)[number],
    (typeof entityFilterSchemas)[number],
    ...(typeof entityFilterSchemas)[number][],
  ],
);

const entityValues = getAllEntityNames().map((name) => {
  const entity = getEntityConfigMapping(name);
  return z.object({
    id: z.string().refine((id) => isEntityId(id, name)),
    filter: z.custom<z.infer<typeof entity.filterSchema>>(),
  });
});

export const entityValuesMappingUnion = z.union(
  entityValues as [
    (typeof entityValues)[number],
    (typeof entityValues)[number],
    ...(typeof entityValues)[number][],
  ],
);

export type EntityValuesMappingUnion = z.infer<typeof entityValuesMappingUnion>;
