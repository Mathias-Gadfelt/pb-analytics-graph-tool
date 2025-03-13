import useEntities from "@/hooks/use-entities";
import Chart from "../chart/chart";
import { Button } from "../ui/button";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

function MainWindow() {
  const { entities } = useEntities();
  const { data, refetch, isLoading } = useQuery(
    trpc.data.queryOptions({ entities }, { enabled: false }),
  );
  return (
    <div className="h-screen flex flex-col w-full">
      <div className="w-full h-fit p-2 border-b">
        <Button onClick={() => refetch()} disabled={isLoading}>
          Update
        </Button>
      </div>
      <div className="flex-1 w-full ">
        <Chart data={data ?? {}} />
      </div>
    </div>
  );
}

export default MainWindow;
