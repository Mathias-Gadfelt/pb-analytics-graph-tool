import { sql } from "kysely";
import db from "../../db";
import { EexTradeFilter } from "../../schemas/entity-inputs";
import { GlobalFilter } from "../../schemas/global-inputs";

export const eexGetter = async (
  entityFilter: EexTradeFilter,
  globalFilter: GlobalFilter,
) => {
  const nMinutes = 10;

  const result = await db.futures
    .selectFrom("eex_trades")
    .select([
      sql`TIMESTAMP(DATE(timestamp_UTC), ADDTIME(TIME(timestamp_UTC), SEC_TO_TIME(-MOD(TIME_TO_SEC(TIME(timestamp_UTC)), ${nMinutes} * 60))))`.as(
        "timestamp",
      ),
      "market_area",
      "delivery_period",
      "delivery_start",
      sql`SUBSTRING_INDEX(MIN(CONCAT(timestamp_UTC, '_', price)), '_', -1)`.as(
        "open",
      ),
      sql`MIN(price)`.as("low"),
      sql`MAX(price)`.as("high"),
      sql`SUBSTRING_INDEX(MAX(CONCAT(timestamp_UTC, '_', price)), '_', -1)`.as(
        "close",
      ),
      sql`SUM(price * volume_mwh) / SUM(volume_mwh)`.as("vwap"),
      sql`SUM(volume_lots)`.as("volume_lots"),
      sql`SUM(volume_mwh)`.as("volume_mwh"),
    ])
    .where("timestamp_CET", ">=", new Date("2025-02-20 08:00:00"))
    .where("timestamp_CET", "<", new Date("2025-02-20 18:00:00"))
    .where("load_type", "=", "BASE")
    .groupBy(["timestamp", "market_area", "delivery_period", "delivery_start"])
    .orderBy("market_area")
    .orderBy("delivery_period")
    .orderBy("delivery_start")
    .orderBy("timestamp")
    .execute();

  console.log(result);
  return [];
};
