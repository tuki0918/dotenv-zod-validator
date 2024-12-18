import { type ZodSchema, z } from "zod";

function validateEnv<T extends ZodSchema>(
  schema: T,
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): z.infer<T> {
  const result = schema.safeParse(env);
  if (!result.success) {
    console.error(
      "Environment variable validation failed:",
      result.error.format(),
    );
    throw new Error("Invalid environment variables");
  }
  return result.data;
}

// Custom Zod methods
const envNumber = () =>
  z.preprocess((v) => Number(v) || 0, z.number().int().nonnegative());
const envBoolean = () =>
  z.preprocess((v) => v === "true" || v === "1", z.boolean());

export const zenv = {
  object: z.object,
  enum: z.enum,
  string: z.string,
  number: envNumber,
  boolean: envBoolean,
  validateEnv,
};
