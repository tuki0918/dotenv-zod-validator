import { type ZodSchema, z } from "zod";

function validate<T extends ZodSchema>(
  schema: T,
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
) {
  const result = schema.readonly().safeParse(env);
  if (!result.success) {
    console.error(
      "Environment variable validation failed:",
      result.error.format(),
    );
    throw new Error("Invalid environment variables");
  }
  return result.data;
}

const isUndefinedOrEmpty = (v: unknown): boolean => v === undefined || v === "";

// Custom Zod methods
const envNumber = () =>
  z.preprocess(
    (v) => (isUndefinedOrEmpty(v) ? undefined : Number(v)),
    z.number().int().nonnegative(),
  );
const envBoolean = () =>
  z.preprocess((v) => {
    if (isUndefinedOrEmpty(v)) return undefined;
    if (typeof v === "string") return v.toLowerCase() === "true" || v === "1";
    return v === true || v === 1;
  }, z.boolean());

export const zenv = {
  object: z.object,
  enum: z.enum,
  string: z.string,
  number: envNumber,
  boolean: envBoolean,
  validate,
};
