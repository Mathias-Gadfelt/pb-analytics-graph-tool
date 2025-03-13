import sys
import json
import pandas as pd

# freq_mapping for frequency conversion
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
    # Create DataFrame from the list of dictionaries
    df = pd.DataFrame(data)

    # Convert timestamp column to datetime, sort and set as index
    df['timestamp_UTC'] = pd.to_datetime(df['timestamp_UTC'])
    df = df.sort_values('timestamp_UTC').set_index('timestamp_UTC')

    # Convert OHLC and VWAP columns to numeric types
    df['open'] = df['open'].astype(float)
    df['high'] = df['high'].astype(float)
    df['low'] = df['low'].astype(float)
    df['close'] = df['close'].astype(float)
    df['vwap'] = df['vwap'].astype(float)
    df['volume_vwap'] = df['volume_vwap'].astype(float)

    # Determine frequency string based on interval and type
    freq_code = freq_mapping.get(intervalType)
    if freq_code is None:
        raise ValueError(f"Unsupported interval type: {intervalType}")
    freq = f"{interval}{freq_code}"

    # Resample to compute aggregated OHLC values
    ohlc = df[['open', 'high', 'low', 'close']].resample(freq).agg({
        'open': 'first',
        'high': 'max',
        'low': 'min',
        'close': 'last'
    })

    # Compute aggregated VWAP as the volume-weighted average price
    aggregated_vwap = (df['vwap'] * df['volume_vwap']).resample(freq).sum() / df['volume_vwap'].resample(freq).sum()

    result = ohlc.join(aggregated_vwap.rename('vwap'))

    # Fill missing OHLC values with the latest non-NaN close value
    result['close'] = result['close'].ffill()
    for col in ['open', 'high', 'low']:
        result[col] = result[col].fillna(result['close'])

    # Fill missing VWAP values using forward fill
    result['vwap'] = result['vwap'].ffill()

    # Reset the index and rename timestamp_UTC to timestampUTC
    result = result.reset_index().rename(columns={'timestamp_UTC': 'timestampUTC'})
    result['timestampUTC'] = result['timestampUTC'].astype(str)

    return result.to_dict(orient='records')


def main():
    input_str = sys.stdin.read()

    try:
        input_json = json.loads(input_str)
    except Exception:
        sys.stderr.write("Error parsing JSON input.\n")
        sys.exit(1)

    data = input_json.get("inputData")
    filter = input_json.get("filter")

    output = process_data(data, filter.get("interval"), filter.get("intervalType"))
    print(json.dumps(output))
    sys.stdout.flush()

if __name__ == "__main__":
    main()

