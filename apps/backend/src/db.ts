import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";

export interface Database {
  epex_continous_agg: EpexContinuousAgg;
  eex_trades: EexTrades;
}

const createDialect = (dbName: string) =>
  new MysqlDialect({
    pool: createPool({
      database: dbName,
      host: "192.168.8.108",
      port: 3306,
      user: "mrg",
      password: "pbanal",
    }),
  });

const db = {
  intraday: new Kysely<Database>({ dialect: createDialect("intraday") }),
  futures: new Kysely<Database>({ dialect: createDialect("futures") }),
};
export default db;

// Type for epex_continous_agg model
type EpexContinuousAgg = {
  id: bigint;
  delivery_date: Date;
  market_area: string;
  product: string;
  delivery_period: number;
  timestamp_UTC: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  vwap: number;
  volume_vwap: number;
  volume_buy: number;
  volume_sell: number;
  delivery_month: number;
  datetime_added: Date;
};

// Type for eex_trades model
type EexTrades = {
  id: number;
  product_code: string;
  product: string;
  root: string;
  market_area: string;
  delivery_period: string;
  load_type: string;
  timestamp_UTC: Date;
  timestamp_CET: Date;
  price: number;
  volume_mwh: number;
  volume_lots: number;
  delivery_start: Date;
  delivery_end: Date;
  trade_id: string;
  delivery_timezone: string;
  venue: string;
  front: number;
  valid: boolean;
  datetime_added: Date;
};
