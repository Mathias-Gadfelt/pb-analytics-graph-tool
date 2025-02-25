import { publicProcedure, router } from "./trpc";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { querySchema } from "./schemas/query";
import { getEntity, toEntityName } from "./entities/utils";

const appRouter = router({
  test: publicProcedure.input(querySchema).query(async (opts) => {
    const { input } = opts;
    const { entities, globalFilter } = input;

    return await Promise.all(
      entities.map(async ({ id, filter: entityFilter }) => {
        const entityName = toEntityName(id);
        const entity = getEntity(entityName);

        return await { id: entity.get(entityFilter, globalFilter) };
      }),
    );
  }),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

const PORT = 3000;
server.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
