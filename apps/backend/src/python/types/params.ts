import { EexTradeFilter, EpexContinousAggFilter } from "@repo/entities";

interface IEExParams {
  script: "eex";
  inputData: {
    id: number;
    product_code: string;
    product: string;
    root: string;
    market_area: string;
    delivery_period: string;
    load_type: string;
    timestamp_UTC: string; // ISO 8601 timestamp
    timestamp_CET: string; // ISO 8601 timestamp
    price: string;
    volume_mwh: number;
    volume_lots: number;
    delivery_start: string; // ISO 8601 timestamp
    delivery_end: string; // ISO 8601 timestamp
    trade_id: string;
    delivery_timezone: string;
    venue: string;
    front: number;
    valid: number;
    datetime_added: string; // ISO 8601 timestamp
  }[];
  filter: EexTradeFilter;
}

interface IEpexParams {
  script: "epex";
  inputData: {
    id: number;
    delivery_date: string; // ISO 8601 timestamp
    market_area: string;
    product: string;
    delivery_period: number;
    timestamp_UTC: string; // ISO 8601 timestamp
    open: string;
    high: string;
    low: string;
    close: string;
    vwap: string;
    volume_vwap: string;
    volume_buy: string;
    volume_sell: string;
    delivery_month: number;
    datetime_added: string; // ISO 8601 timestamp
  }[];
  filter: EpexContinousAggFilter;
}

export type AnyParams = IEExParams | IEpexParams;
