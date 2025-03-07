import { MarketData, MarketDataMapping } from "@repo/entities";
import Plot from "react-plotly.js";
import useChartColors from "./use-chart-colors";
import { useMemo } from "react";

function Chart({
  data,
  useLogScale = false,
}: {
  data: MarketDataMapping;
  useLogScale?: boolean;
}) {
  const generateRandomColors = useChartColors();

  const formattedData = useMemo(() => {
    // Get all unique sorted dates across all datasets
    const allDates = new Set<string>();
    for (const entries of Object.values(data)) {
      for (const entry of entries) {
        allDates.add(new Date(entry.timestampUTC).toISOString());
      }
    }
    const sortedDates = Array.from(allDates).sort();

    const traces: any[] = [];

    for (const [key, entries] of Object.entries(data)) {
      // Create a more robust date-to-entry map
      const dateToEntryMap = new Map(
        entries.map((entry) => [
          new Date(entry.timestampUTC).toISOString(),
          entry,
        ]),
      );

      const colors = generateRandomColors();

      // Create data series with explicit handling of gaps
      const createDataSeries = (accessor: (entry: MarketData) => number) =>
        sortedDates.map((date) => {
          const entry = dateToEntryMap.get(date);
          return entry ? accessor(entry) : null;
        });

      // Candlestick trace
      traces.push({
        type: "candlestick",
        x: sortedDates,
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
        title: "Multiple Candlestick Charts",
        xaxis: {
          rangeslider: { visible: false },
          type: "date",
        },
        yaxis: {
          title: "Price",
          type: useLogScale ? "log" : "linear",
          // Add some padding to log scale to ensure visibility
          range: useLogScale
            ? [
                Math.log10(
                  Math.max(
                    1,
                    Math.min(
                      ...formattedData.flatMap(
                        (trace) =>
                          trace.low?.filter((val) => val !== null) || [],
                      ),
                    ),
                  ),
                ),
                Math.log10(
                  Math.max(
                    ...formattedData.flatMap(
                      (trace) =>
                        trace.high?.filter((val) => val !== null) || [],
                    ),
                  ),
                ),
              ]
            : undefined,
        },
        modebar: {
          orientation: "v",
        },
        legend: {
          orientation: "h",
        },
      }}
      config={{
        // Allow switching between linear and log scale
        editable: true,
        responsive: true,
      }}
      style={{ height: "100%", width: "100%" }}
    />
  );
}

export default Chart;
