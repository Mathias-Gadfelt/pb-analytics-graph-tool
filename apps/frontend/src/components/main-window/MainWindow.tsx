import useExistingEntities from "@/hooks/useExistingEntities";
import Chart from "../chart/Chart";
import { Button } from "../ui/button";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

function MainWindow() {
  const { entities } = useExistingEntities();
  const { data, refetch, isLoading } = useQuery(
    trpc.test.queryOptions({ entities }, { enabled: false }),
  );
  console.log(data);
  return (
    <div className="h-screen flex flex-col w-full">
      <div className="w-full h-fit p-2 border-b">
        <Button onClick={() => refetch()} disabled={isLoading}>
          Update
        </Button>
      </div>
      <div className="flex-1 w-full bg-red-500">
        <Chart data={data! ?? {}} />
      </div>
    </div>
  );
}

export default MainWindow;
