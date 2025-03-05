import {
  EntityId,
  EntityIdToName,
  EntityWithInferedSchema,
} from "@repo/entities";

type IEpexForm<TEntityId extends EntityId<"epex">> = {
  filter: EntityWithInferedSchema<EntityIdToName<TEntityId>>["filter"];
  id: TEntityId;
  onSuccess: () => void;
};

function EpexForm<TEntityId extends EntityId<"epex">>({
  filter,
  id,
  onSuccess,
}: IEpexForm<TEntityId>) {
  return <>{JSON.stringify(filter)}</>;
}

export default EpexForm;
