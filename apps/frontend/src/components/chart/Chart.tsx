import { CommonEntitiesUnion } from "@repo/entities";
import Plot from "react-plotly.js";
import useChartColors from "./useChartColors";

function Chart({ data }: { data: CommonEntitiesUnion }) {
  const generateRandomColors = useChartColors();

  const formatDataForChart = (data: CommonEntitiesUnion) => {
    // Extract all unique dates
    const allDates = new Set<string>();
    Object.values(data).forEach((entries) => {
      entries.forEach((entry) => {
        allDates.add(new Date(entry.timestampUTC).toISOString().split("T")[0]);
      });
    });
    const sortedDates = Array.from(allDates).sort();

    // Create traces for each entity (both candlestick and VWAP line)
    const traces: Data = [];

    Object.entries(data).forEach(([key, entries]) => {
      // Create date-to-entry map
      const dateToEntryMap = new Map();
      entries.forEach((entry) => {
        const dateStr = new Date(entry.timestampUTC)
          .toISOString()
          .split("T")[0];
        dateToEntryMap.set(dateStr, entry);
      });

      // Generate consistent colors for this entity
      const colors = generateRandomColors();

      // Candlestick trace
      traces.push({
        type: "candlestick" as "candlestick",
        x: sortedDates,
        open: sortedDates.map((date) =>
          dateToEntryMap.has(date) ? dateToEntryMap.get(date).open : null,
        ),
        high: sortedDates.map((date) =>
          dateToEntryMap.has(date) ? dateToEntryMap.get(date).high : null,
        ),
        low: sortedDates.map((date) =>
          dateToEntryMap.has(date) ? dateToEntryMap.get(date).low : null,
        ),
        close: sortedDates.map((date) =>
          dateToEntryMap.has(date) ? dateToEntryMap.get(date).close : null,
        ),
        name: `${key} Price`,
        connectgaps: false,
        ...colors,
      });

      // VWAP line trace
      traces.push({
        type: "scatter" as "scatter",
        mode: "lines",
        x: sortedDates,
        y: sortedDates.map((date) =>
          dateToEntryMap.has(date) ? dateToEntryMap.get(date).vwap : null,
        ),
        name: `${key} VWAP`,
        line: {
          color: colors.default,
          width: 2,
        },
        connectgaps: true,
      });
    });

    return traces;
  };
  const formattedData = formatDataForChart(data);

  return (
    <Plot
      data={formattedData}
      layout={{
        title: "Multiple Candlestick Charts",
        xaxis: { rangeslider: { visible: false } },
        yaxis: { title: "Price" },
        modebar: {
          orientation: "v",
        },
        legend: {
          orientation: "h",
        },
      }}
      style={{ height: "100%", width: "100%" }}
    />
  );
}

export default Chart;
