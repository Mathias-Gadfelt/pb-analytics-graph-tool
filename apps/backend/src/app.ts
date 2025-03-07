import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { publicProcedure, router } from "./trpc.js";
import { querySchema } from "./schemas/query.js";
import { MarketDataMapping, toEntityName } from "@repo/entities";
import { getEntityGetter } from "./entities/getter-map.js";
import cors from "cors";

const appRouter = router({
  test: publicProcedure.input(querySchema).query(async (opts) => {
    const { input } = opts;
    const { entities } = input;

    const allEntities: MarketDataMapping = {};

    await Promise.all(
      entities.map(async ({ id, filter: entityFilter }) => {
        const entityName = toEntityName(id);
        const getter = getEntityGetter(entityName);
        const result = await getter(entityFilter);
        allEntities[id] = result;
      }),
    );

    return allEntities;
  }),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  middleware: cors(),
});

const PORT = 3000;
server.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
