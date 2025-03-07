import { useCallback, useRef } from "react";

const COLOR_PALETTES = [
  { hue: 0, name: "red" },
  { hue: 210, name: "blue" },
  { hue: 120, name: "green" },
  { hue: 300, name: "purple" },
  { hue: 45, name: "orange" },
  { hue: 180, name: "teal" },
  { hue: 270, name: "violet" },
  { hue: 80, name: "lime" },
  { hue: 330, name: "pink" },
  { hue: 150, name: "seafoam" },
  { hue: 30, name: "amber" },
  { hue: 240, name: "navy" },
  { hue: 15, name: "crimson" },
  { hue: 195, name: "skyBlue" },
  { hue: 280, name: "indigo" },
  { hue: 60, name: "yellow" },
  { hue: 340, name: "magenta" },
  { hue: 170, name: "mint" },
  { hue: 290, name: "orchid" },
  { hue: 100, name: "chartreuse" },
];

// Use React refs to track used colors
const useChartColors = () => {
  const usedColorIndices = useRef<Set<number>>(new Set());

  const generateRandomColors = useCallback(() => {
    let index;
    do {
      index = Math.floor(Math.random() * COLOR_PALETTES.length);
    } while (
      usedColorIndices.current.size < COLOR_PALETTES.length &&
      usedColorIndices.current.has(index)
    );

    // Reset if all colors used
    if (usedColorIndices.current.size >= COLOR_PALETTES.length) {
      usedColorIndices.current.clear();
    }
    usedColorIndices.current.add(index);

    const { hue } = COLOR_PALETTES[index];

    return {
      decreasing: {
        line: { color: `hsl(${hue}, 85%, 40%)` },
      },
      default: `hsl(${hue}, 70%, 50%)`,
      increasing: {
        line: { color: `hsl(${hue}, 85%, 60%)` },
      },
      vwapColor: `hsl(${hue}, 85%, 50%)`,
    };
  }, []);

  return generateRandomColors;
};
export default useChartColors;
