import { AnyEntityName, EntityFromName, EntityId } from "./types.js";
import { ENTITIES } from "./entities.js";

export const getAllEntityNames = <T extends typeof ENTITIES>(): {
  [K in keyof T]: T[K] extends { name: infer U } ? U : never;
} => {
  return ENTITIES.map((x) => x.name) as any;
};

export const getEntity = <TName extends AnyEntityName>(
  name: TName,
): EntityFromName<TName> =>
  ENTITIES.find((x) => x.name === name)! as EntityFromName<TName>;

export const toEntityId = <TName extends AnyEntityName, TNumber extends number>(
  name: TName,
  id: TNumber,
): EntityId<TName, TNumber> => `${name}-${id}`;

export const toEntityName = <TName extends AnyEntityName>(
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
): value is EntityId<AnyEntityName, number> => {
  if (expectedName) {
    const prefixTest = value.startsWith(`${expectedName}-`);
    if (!prefixTest) return false;
  }
  const regTest = /^[a-zA-Z]+-\d+$/.test(value);
  if (!regTest) return false;
  const typedId = value as EntityId<AnyEntityName, number>;
  const name = toEntityName(typedId);
  const doesNameExist = getAllEntityNames().includes(name);
  return doesNameExist;
};
