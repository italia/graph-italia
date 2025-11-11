import { z } from "zod";
import { transposeData } from "./utils";
import { MatrixType } from "../types";

export function validateStructure(data: MatrixType) {
  const schema = z.array(z.array(z.union([z.string(), z.number()])));
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error("Invalid data structure");
  }

  const [header, ...rows] = data as unknown as string[][];
  const headerSchema = z.array(z.string());
  const headerResult = headerSchema.safeParse(header);
  if (!headerResult.success) {
    throw new Error("Must have a header row with labels");
  }
  const valueSchema = z.array(z.number());
  const stringSchema = z.array(z.string());

  const columns = transposeData(rows);
  console.log("COLUMNS", columns);

  columns.forEach((column: [string | number], index: number) => {
    console.log("============");
    console.log("COLUMN", index, column);

    const valueResult = valueSchema.safeParse(column);
    if (valueResult.success) console.log("VALUE RESULT", valueResult);

    const stringResult = stringSchema.safeParse(column);
    if (stringResult.success) console.log("STRNG RESULT", stringResult);

    const columnResult = valueResult.success || stringResult.success;

    console.log("COLUMN RESULT", columnResult);

    if (!columnResult) {
      const columnName = header[index];
      throw new Error(
        `Column "${columnName}" must contain only numbers or only strings`
      );
    }
  });

  return data;
}

export default function isValidData(data: string) {
  try {
    const parsedData = JSON.parse(data);
    validateStructure(parsedData);
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
  return true;
}
