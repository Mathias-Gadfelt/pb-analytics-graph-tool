import { Options, PythonShell } from "python-shell";
import { AnyParams } from "./types/params.js";
import { MarketData } from "@repo/entities";
import path = require("path");

export const manipulateData = async ({
  script,
  ...scriptInput
}: AnyParams): Promise<MarketData[]> => {
  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const scriptPath = path.join(__dirname, "scripts", `${script}.py`);
    const pythonPath = path.join(__dirname, "scripts", "venv", "bin", "python");

    // Create a Python shell with stdin mode
    const pyshell = new PythonShell(scriptPath, {
      mode: "json",
      pythonOptions: ["-u"],
      pythonPath: pythonPath,
    });

    // Send data via stdin
    pyshell.send(scriptInput);

    return new Promise((resolve, reject) => {
      // Just resolve with the first message received
      pyshell.on("message", (message) => {
        console.log(`Message: ${message}`);
        resolve(message);
      });

      pyshell.on("error", (err) => {
        console.log(err);
        reject(err);
      });

      pyshell.end((err) => {
        console.log(err);
        if (err) reject(err);
      });
    });
  } catch (e) {
    console.error(e);
    return [];
  }
};
