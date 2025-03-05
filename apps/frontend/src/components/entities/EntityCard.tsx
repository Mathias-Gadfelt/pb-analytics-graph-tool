import { ExistingEntities } from "@/routes";
import { idToUppercase } from "@/utils/utils";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  EntityId,
  EntityIdToName,
  EntityWithInferedSchema,
  toEntityName,
} from "@repo/entities";
import EexForm from "../forms/EexForm";
import EpexForm from "../forms/EpexForm";
import { useState } from "react";
import useExistingEntities from "@/hooks/useExistingEntities";

interface IEntityCardProps {
  entity: ExistingEntities[number];
}

type FormsMap<TEntityId extends EntityId = EntityId> = {
  [K in EntityIdToName<TEntityId>]: React.ComponentType<{
    filter: EntityWithInferedSchema<K>["filter"];
    id: EntityId<K>;
    onSuccess: () => void;
  }>;
};

const formsMap: FormsMap = {
  eex: EexForm,
  epex: EpexForm,
};

function EntityCard({ entity }: IEntityCardProps) {
  const Form = formsMap[toEntityName(entity.id)];
  const [open, setOpen] = useState(false);
  const { remove } = useExistingEntities();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="w-full h-fit flex flex-col rounded border py-2 px-4 divide-y text-left"
        >
          <div className="flex justify-between items-center">
            <p>{idToUppercase(entity.id)}</p>
            <Button
              variant={"ghost"}
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                remove(entity.id);
              }}
            >
              <XIcon />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">Filter preview...</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Opdater filtre</DialogTitle>
          {/*TODO: Fix type*/}
          <Form
            filter={entity.filter as any}
            id={entity.id as any}
            onSuccess={() => setOpen(false)}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EntityCard;
