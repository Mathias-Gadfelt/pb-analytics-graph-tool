import { EexTradeFilter } from "@repo/entities";
import db from "../../db.js";
import pl from "nodejs-polars";

export const eexGetter = async (entityFilter: EexTradeFilter) => {
  const {
    interval,
    intervalType,
    from,
    to,
    marketArea,
    productCode,
    deliveryPeriod,
  } = entityFilter;

  let query = db.futures
    .selectFrom("eex_trades")
    .selectAll()
    .where("delivery_end", ">=", new Date(from))
    .where("delivery_end", "<", new Date(to))
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

  let df = pl.DataFrame(result);

  return df
    .sort("timestamp_UTC")
    .groupByDynamic({
      indexColumn: "timestamp_UTC",
      every: `${interval + intervalType}`,
      period: `${interval + intervalType}`,
      start_by: "datapoint",
      offset: "-1m",
    })
    .agg([
      pl.col("price").cast(pl.Float64).max().alias("high"),
      pl.col("price").cast(pl.Float64).min().alias("low"),
      pl.col("price").cast(pl.Float64).first().alias("open"),
      pl.col("price").cast(pl.Float64).last().alias("close"),
      pl.col("timestamp_UTC").first().as("timestampUTC"),

      // VWAP Calculation: sum(price * volume) / sum(volume)
      pl
        .col("price")
        .cast(pl.Float64)
        .mul(pl.col("volume_mwh").cast(pl.Int64))
        .sum()
        .alias("vwap_numerator"),
      pl.col("volume_mwh").cast(pl.Int64).sum().alias("vwap_denominator"),
      pl
        .col("price")
        .cast(pl.Float64)
        .mul(pl.col("volume_mwh").cast(pl.Int64))
        .sum()
        .div(pl.col("volume_mwh").cast(pl.Int64).sum())
        .alias("vwap"),
    ])
    .select("timestampUTC", "high", "low", "open", "close", "vwap")
    .toRecords() as any;
};
