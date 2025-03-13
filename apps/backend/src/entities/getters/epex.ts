import { EpexContinousAggFilter } from "@repo/entities";
import db from "../../db.js";
import { manipulateData } from "../../python/wrapper.js";

export const epexGetter = async (entityFilter: EpexContinousAggFilter) => {
  const { marketArea, product, from, to } = entityFilter;

  let query = db.intraday
    .selectFrom("epex_continous_agg")
    .selectAll()
    .where("delivery_date", ">", from)
    .where("delivery_date", "<", to)
    .where("delivery_month", "in", generateDeliveryMonths(from, to));

  if (marketArea) {
    query = query.where("market_area", "=", marketArea);
  }

  if (product) {
    query = query.where("product", "=", product);
  }

  const result = await query.execute();
  if (result.length === 0) return [];

  return await manipulateData({
    script: "epex",
    inputData: result as any,
    filter: entityFilter,
  });
};

const generateDeliveryMonths = (from: Date, to: Date): number[] => {
  const result: number[] = [];
  let currentDate = new Date(from);

  while (currentDate <= to) {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Get month in two digits
    result.push(Number(`${year}${month}`));

    // Increment the month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return result;
};
