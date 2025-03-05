import { CommonEntity, EpexContinousAggFilter } from "@repo/entities";
import pl from "nodejs-polars";
import db from "../../db.js";

export const epexGetter = async (
  entityFilter: EpexContinousAggFilter,
): Promise<CommonEntity[]> => {
  const {
    marketArea,
    product,
    deliveryMonth,
    from,
    to,
    intervalType,
    interval,
  } = entityFilter;

  let query = db.intraday
    .selectFrom("epex_continous_agg")
    .selectAll()
    .where("delivery_date", ">=", new Date(from))
    .where("delivery_date", "<", new Date(to))
    .where("delivery_month", "=", deliveryMonth);

  if (marketArea) {
    query = query.where("market_area", "=", marketArea);
  }

  if (product) {
    query = query.where("product", "=", product);
  }

  const result = await query.execute();
  if (result.length === 0) return [];

  return pl
    .DataFrame(result)
    .sort("timestamp_UTC")
    .groupByDynamic({
      indexColumn: "timestamp_UTC",
      every: `${interval + intervalType}`,
      period: `${interval + intervalType}`,
      start_by: "datapoint",
      offset: "-1m",
    })
    .agg([
      pl.col("open").first().alias("open"),
      pl.col("close").last().alias("close"),
      pl.col("high").max().alias("high"),
      pl.col("low").min().alias("low"),
      pl.col("timestamp_UTC").first().as("timestampUTC"),
      pl
        .col("vwap")
        .cast(pl.Float64)
        .mul(pl.col("volume_vwap").cast(pl.Float64))
        .sum()
        .div(pl.col("volume_vwap").cast(pl.Float64).sum())
        .alias("vwap"),
    ])
    .select(
      "timestampUTC", // Explicitly include timestamp_UTC in the selection
      "high",
      "low",
      "open",
      "close",
      "vwap",
    )
    .toRecords() as any;
};
