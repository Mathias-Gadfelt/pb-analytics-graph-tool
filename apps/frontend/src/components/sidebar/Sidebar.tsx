import useExistingEntities from "@/hooks/useExistingEntities";
import NewEntityDropdown from "./NewEntityDropdown";
import EntityCard from "../entities/EntityCard";

function Sidebar() {
  const { entities } = useExistingEntities();

  return (
    <div className="h-screen w-1/3 max-w-lg border-r flex flex-col px-4 gap-4">
      <div className="w-full h-fit flex border-b p-2 items-center gap-2">
        <NewEntityDropdown />
      </div>
      <div className="h-full w-full flex flex-col gap-2">
        {entities.map((entity) => (
          <EntityCard entity={entity} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
