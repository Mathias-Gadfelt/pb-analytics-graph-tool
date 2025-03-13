import { LRUCache } from "lru-cache";
import crypto from "crypto";
import zlib from "zlib";
import { AnyEntityFilter, MarketData } from "@repo/entities";
import { deepSortObjectByKeys } from "./utils.js";

class Cache {
  readonly $cache;

  constructor() {
    const CACHE_OPTIONS = {
      max: 100,
      maxSize: 1 * 1024 * 1024 * 1024, //1GB,
      sizeCalculation: (value: any) => value.length,
      ttl: 1000 * 60 * 15, //15 Minutes
      updateAgeOnGet: true,
    };

    this.$cache = new LRUCache(CACHE_OPTIONS);
  }

  private hashKey = (key: AnyEntityFilter) => {
    const sorted = deepSortObjectByKeys(key);
    const string = JSON.stringify(sorted);
    return crypto.createHash("sha256").update(string).digest("hex");
  };

  private compress = (data: MarketData[]) =>
    zlib.deflateSync(JSON.stringify(data));

  private decompress = (data: Buffer) =>
    JSON.parse(zlib.inflateSync(data).toString("utf-8"));

  insert(filter: AnyEntityFilter, marketData: MarketData[]) {
    const key = this.hashKey(filter);
    console.log(key);
    const compressed = this.compress(marketData);
    this.$cache.set(key, compressed);
  }

  get(filter: AnyEntityFilter): MarketData[] | undefined {
    const key = this.hashKey(filter);
    const compressed = this.$cache.get(key);
    if (!compressed) return undefined;
    const decompressed = this.decompress(compressed);
    return decompressed;
  }
}

const cache = new Cache();
export default cache;
