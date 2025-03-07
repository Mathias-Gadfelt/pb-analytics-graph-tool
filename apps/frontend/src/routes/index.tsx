import MainWindow from "@/components/main-window/MainWindow";
import Sidebar from "@/components/sidebar/Sidebar";
import { entityValuesMappingUnion } from "@repo/entities";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const searchValidator = z.object({
  entities: z.array(entityValuesMappingUnion),
});
export type ExistingEntities = z.infer<typeof searchValidator>["entities"];

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: searchValidator.catch({ entities: [] }),
});

function Index() {
  return (
    <div className="flex">
      <Sidebar />
      <MainWindow />
    </div>
  );
}
