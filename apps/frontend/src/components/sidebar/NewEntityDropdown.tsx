import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createId, idToUppercase, upsert } from "@/utils/utils";
import { AnyEntityName, ENTITIES } from "@repo/entities";
import { useNavigate } from "@tanstack/react-router";
import { getDefaultEntity } from "@/lib/entities/default-entities";
import useExistingEntities from "@/hooks/useExistingEntities";

function NewEntityDropdown() {
  const { entities } = useExistingEntities();
  const navigate = useNavigate({ from: "/" });

  const addNewEntity = (entityName: AnyEntityName) => {
    const defaultObject = getDefaultEntity(entityName);
    const id = createId(entityName, entities);
    navigate({
      search: {
        entities: upsert(entities, { id: id, filter: defaultObject }),
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Plus />
          <p className="text-sm text-muted-foreground">Tilføj</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {ENTITIES.map((entity) => (
          <DropdownMenuItem
            key={entity.name}
            onClick={() => addNewEntity(entity.name)}
          >
            {idToUppercase(entity.name)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NewEntityDropdown;
