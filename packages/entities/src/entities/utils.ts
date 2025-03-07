import { EntityName, ExtractEntityConfigMapping, EntityId } from "./types.js";
import { CONFIGS } from "./entities.js";

export const getAllEntityNames = <T extends typeof CONFIGS>(): {
  [K in keyof T]: T[K] extends { name: infer U } ? U : never;
} => {
  return CONFIGS.map((x) => x.name) as any;
};

export const getEntityConfigMapping = <TName extends EntityName>(
  name: TName,
): ExtractEntityConfigMapping<TName> =>
  CONFIGS.find((x) => x.name === name)! as ExtractEntityConfigMapping<TName>;

export const toEntityId = <TName extends EntityName, TNumber extends number>(
  name: TName,
  id: TNumber,
): EntityId<TName, TNumber> => `${name}-${id}`;

export const toEntityName = <TName extends EntityName>(
  entityId: EntityId<TName, number>,
): TName => {
  const dashIndex = entityId.lastIndexOf("-");
  if (dashIndex === -1) return entityId as TName; // If no dash is found, return the original string
  return entityId.substring(0, dashIndex) as TName;
};

//Checks if the format of the ID is valid, and that the entity name the id refers to, is valid.
export const isEntityId = (
  value: string,
  expectedName?: string,
): value is EntityId<EntityName, number> => {
  if (expectedName) {
    const prefixTest = value.startsWith(`${expectedName}-`);
    if (!prefixTest) return false;
  }
  const regTest = /^[a-zA-Z]+-\d+$/.test(value);
  if (!regTest) return false;
  const typedId = value as EntityId<EntityName, number>;
  const name = toEntityName(typedId);
  const doesNameExist = getAllEntityNames().includes(name);
  return doesNameExist;
};
