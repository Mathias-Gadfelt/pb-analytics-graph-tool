import { MarketData, MarketDataMapping } from "@repo/entities";
import Plot from "react-plotly.js";
import useChartColors from "./use-chart-colors";
import { useMemo } from "react";

function Chart({ data }: { data: MarketDataMapping }) {
  const generateRandomColors = useChartColors();
  console.log(data);
  const formattedData = useMemo(() => {
    const allDates = new Set<string>();
    for (const entries of Object.values(data)) {
      for (const entry of entries) {
        allDates.add(new Date(entry.timestampUTC).toISOString());
      }
    }

    const sortedDates = Array.from(allDates).sort();

    const traces: Plotly.Data[] = [];

    for (const [key, entries] of Object.entries(data)) {
      const dateToEntryMap = new Map(
        entries.map((entry) => [
          new Date(entry.timestampUTC).toISOString(),
          entry,
        ]),
      );

      const colors = generateRandomColors();

      const createDataSeries = (accessor: (entry: MarketData) => number) =>
        sortedDates.map((date) => {
          const entry = dateToEntryMap.get(date);
          return entry ? accessor(entry) : NaN; // Use NaN for gaps
        });

      // Candlestick trace
      traces.push({
        type: "candlestick",
        x: sortedDates, // Use full timestamp for finer granularity
        open: createDataSeries((entry) => entry.open),
        high: createDataSeries((entry) => entry.high),
        low: createDataSeries((entry) => entry.low),
        close: createDataSeries((entry) => entry.close),
        name: `${key} Price`,
        connectgaps: true,
        ...colors,
      });

      // VWAP line trace
      traces.push({
        type: "scatter",
        mode: "lines",
        x: sortedDates,
        y: createDataSeries((entry) => entry.vwap),
        name: `${key} VWAP`,
        line: {
          color: colors.default,
          width: 2,
        },
        connectgaps: true,
      });
    }

    return traces;
  }, [data, generateRandomColors]);

  return (
    <Plot
      data={formattedData}
      layout={{
        xaxis: {
          rangeslider: { visible: false },
        },
        yaxis: {
          title: "Price",
        },
        modebar: {
          orientation: "v",
        },
        legend: {
          orientation: "h",
        },
      }}
      config={{
        responsive: true,
      }}
      style={{ height: "100%", width: "100%" }}
    />
  );
}

export default Chart;
