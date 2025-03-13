import useEntities from "@/hooks/use-entities";
import NewEntityDropdown from "./new-entity-dropdown";
import EntityCard from "../entities/entity-card";

function Sidebar() {
  const { entities } = useEntities();

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
