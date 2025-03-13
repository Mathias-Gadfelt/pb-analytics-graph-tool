import sys
import json
import pandas as pd

freq_mapping = {
    "m": "T",    # minute
    "h": "h",    # hour
    "d": "D",    # day
    "w": "W",    # week
    "mo": "MS",  # month start
    "q": "QS",   # quarter start
    "y": "AS"    # year start
}

def process_data(data, interval, intervalType):
    df = pd.DataFrame(data)
    df['timestamp_UTC'] = pd.to_datetime(df['timestamp_UTC'])
    df = df.sort_values('timestamp_UTC').set_index('timestamp_UTC')

    df['price'] = df['price'].astype(float)
    df['volume_mwh'] = df['volume_mwh'].astype(int)
    df['price_vol'] = df['price'] * df['volume_mwh']

    freq_code = freq_mapping.get(intervalType)
    if freq_code is None:
        raise ValueError(f"Unsupported interval type: {intervalType}")
    freq = f"{interval}{freq_code}"

    # Resample to get OHLC for price and compute VWAP
    ohlc = df["price"].resample(freq).ohlc()
    vwap = df["price_vol"].resample(freq).sum() / df["volume_mwh"].resample(freq).sum()

    result = ohlc.join(vwap.rename('vwap'))

    # Fill missing OHLC values with the latest non-NaN close value
    result['close'] = result['close'].ffill()
    for col in ['open', 'high', 'low']:
        result[col] = result[col].fillna(result['close'])

    # Fill missing VWAP values using forward fill
    result['vwap'] = result['vwap'].ffill()

    # Reset the index and rename timestamp_UTC to timestampUTC
    result = result.reset_index().rename(columns={'timestamp_UTC': 'timestampUTC'})
    result['timestampUTC'] = result['timestampUTC'].astype(str)

    return result.to_dict(orient="records")

def main():
    input_str = sys.stdin.read()

    try:
        input_json = json.loads(input_str)
    except Exception:
        sys.stderr.write("Error parsing JSON input.\n")
        sys.exit(1)
        # Expect the input to contain "inputData", and "filter" with properties interval and intervalType
    data = input_json.get("inputData")
    filter = input_json.get("filter")

    output = process_data(data, filter.get("interval"), filter.get("intervalType"))
    print(json.dumps(output))
    sys.stdout.flush()

if __name__ == "__main__":
    main()

