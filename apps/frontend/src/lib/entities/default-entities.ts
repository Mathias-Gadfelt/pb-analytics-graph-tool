import { EntityName } from "@repo/entities";

const defaultTimeObject = {
  from: new Date(new Date().setMonth(new Date().getMonth() - 1)), //A month ago
  to: new Date(), //Now
  interval: 1,
  intervalType: "h",
} as const;

const entitiesDefaultMap = {
  eex: {
    ...defaultTimeObject,
  },
  epex: {
    ...defaultTimeObject,
    deliveryMonth: 202101,
  },
};

export const getDefaultEntity = <TName extends EntityName>(entityName: TName) =>
  entitiesDefaultMap[entityName];
