import { CommonEntity } from "../../schemas/common-entity";
import { EpexContinousAggFilter } from "../../schemas/entity-inputs";
import { GlobalFilter } from "../../schemas/global-inputs";
import db from "../../db";
import { sql } from "kysely";
import { intervalToMinutes } from "../utils";

export const epexGetter = async (
  entityFilter: EpexContinousAggFilter,
  globalFilter: GlobalFilter,
): Promise<CommonEntity[]> => {
  const { fromUtc, toUtc, intervalType } = globalFilter;
  const { marketArea, product } = entityFilter;

  console.log(product);
  console.log(marketArea);
  console.log(entityFilter);

  const intervalMinutes = intervalToMinutes(intervalType);

  let query = db.intraday
    .selectFrom("epex_continous_agg")
    .select([
      sql`TIMESTAMP(DATE(timestamp_UTC), ADDTIME(TIME(timestamp_UTC), SEC_TO_TIME(-MOD(TIME_TO_SEC(TIME(timestamp_UTC)), ${intervalMinutes} * 60))))`.as(
        "timestamp",
      ),
      sql`MAX(open)`.as("open"),
      sql`MAX(close)`.as("close"),
      sql`MAX(low)`.as("low"),
      sql`MAX(high)`.as("high"),
      sql`MAX(vwap)`.as("vwap"),
      "market_area",
      "product",
    ])
    .where("timestamp_UTC", ">=", new Date(fromUtc))
    .where("timestamp_UTC", "<", new Date(toUtc));

  if (product) {
    query = query.where("product", "=", product);
  }

  if (marketArea) {
    query = query.where("market_area", "=", marketArea);
  }

  const result = await query
    .groupBy(["timestamp", "market_area", "product"])
    .orderBy("market_area")
    .orderBy("timestamp")
    .execute();

  return result as any;
};
