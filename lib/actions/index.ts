"use server";

import { generateERD, parseSchema } from "../schema-tool-utils";

export const getERDFromSimple = async (schema: string) => {
  const tables = parseSchema(schema);
  const code = generateERD(tables);
  return code;
};
