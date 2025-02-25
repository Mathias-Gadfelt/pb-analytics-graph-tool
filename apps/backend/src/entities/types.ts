import z from "zod";
import { AnyPrismaModels } from "../prisma";
import { CommonEntity } from "../schemas/common-entity";
import { AnyFilterSchema } from "../schemas/entity-inputs";
import ENTITIES from "./entities";
import { globalFilterSchema } from "../schemas/global-inputs";

export type Entity<TName extends string, TFilter extends AnyFilterSchema> = {
  name: TName;
  filter: TFilter;
  get: (
    entityFilter: z.infer<TFilter>,
    globalFilter: z.infer<typeof globalFilterSchema>,
  ) => Promise<CommonEntity[]>;
};

export type AnyEntityName = (typeof ENTITIES)[number]["name"];
export type EntityFromName<TName extends AnyEntityName> = Extract<
  (typeof ENTITIES)[number],
  { name: TName }
>;
export type EntityId<
  TName extends AnyEntityName,
  TNumber extends number,
> = `${TName}-${TNumber}`;
