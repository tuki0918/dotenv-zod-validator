import { type ZodSchema, z } from "zod";
import { fromError } from "zod-validation-error";

function validate<T extends ZodSchema>(
  schema: T,
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
) {
  const result = schema.readonly().safeParse(env);
  if (!result.success) {
    const validationError = fromError(result.error, {
      prefix: "Invalid environment variables",
    });
    throw validationError;
  }
  return result.data;
}

const isUndefinedOrEmpty = (v: unknown): boolean => v === undefined || v === "";

// Custom Zod methods
const envNumber = () =>
  z.preprocess(
    (v) => (isUndefinedOrEmpty(v) ? undefined : v),
    z.coerce.number(),
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
