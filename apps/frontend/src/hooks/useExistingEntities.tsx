import { upsert } from "@/utils/utils";
import { EntityId, EntityUnion } from "@repo/entities";
import { useNavigate, useSearch } from "@tanstack/react-router";

const useExistingEntities = () => {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const update = (newFilter: EntityUnion) => {
    navigate({
      to: "/",
      search: {
        entities: upsert(search.entities ?? [], newFilter),
      },
    });
  };

  const remove = (id: EntityId) => {
    const withoutDeletedEntity = (search.entities ?? []).filter(
      (x) => x.id !== id,
    );
    navigate({
      to: "/",
      search: {
        entities: withoutDeletedEntity,
      },
    });
  };

  return { entities: search.entities ?? [], update, remove };
};

export default useExistingEntities;
