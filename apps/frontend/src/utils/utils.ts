import { ExistingEntities } from "@/routes";
import { EntityName, EntityId } from "@repo/entities";

export const idToUppercase = (id: string): string => {
  return id
    .replace(/-/g, " ") // Replace all dashes with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const findFirstMissing = (nums: Set<number>) =>
  Array.from({ length: nums.size + 1 }, (_, i) => i).findIndex(
    (i) => !nums.has(i),
  );

export const createId = <TName extends EntityName>(
  name: TName,
  existingEntities: ExistingEntities,
): EntityId<TName> => {
  const takenNumbers = new Set(
    existingEntities
      .map((entity) => entity.id)
      .filter((id) => id.startsWith(`${name}-`))
      .map((id) => parseInt(id.split("-")[1], 10)),
  );

  return `${name}-${findFirstMissing(takenNumbers)}`;
};

export const upsert = <T extends Record<"id", string>>(
  arr: T[],
  newObj: T,
): T[] => {
  const index = arr.findIndex((obj) => obj.id === newObj.id);
  return index === -1
    ? [...arr, newObj]
    : arr.map((obj) => (obj.id === newObj.id ? newObj : obj));
};
