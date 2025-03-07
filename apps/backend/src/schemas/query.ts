import { entityConfigMappingUnion } from "@repo/entities";
import { z } from "zod";

export const querySchema = z.object({
  entities: z.array(entityConfigMappingUnion),
});
