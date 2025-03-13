import { EexTradeFilter } from "@repo/entities";
import db from "../../db.js";
import { manipulateData } from "../../python/wrapper.js";

export const eexGetter = async (entityFilter: EexTradeFilter) => {
  const { from, to, marketArea, productCode, deliveryPeriod } = entityFilter;

  let query = db.futures
    .selectFrom("eex_trades")
    .selectAll()
    .where("delivery_start", ">", from)
    .where("delivery_end", "<", to)
    .where("load_type", "=", "BASE");

  if (productCode) {
    query = query.where("product_code", "=", productCode);
  }
  if (deliveryPeriod) {
    query = query.where("delivery_period", "=", deliveryPeriod);
  }
  if (marketArea) {
    query = query.where("market_area", "=", marketArea);
  }

  const result = await query.execute();
  if (result.length === 0) return [];

  return await manipulateData({
    script: "eex",
    inputData: result as any,
    filter: entityFilter,
  });
};
