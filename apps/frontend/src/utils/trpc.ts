import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../../backend/src/app";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const queryClient = new QueryClient();
const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3000" })],
});
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
