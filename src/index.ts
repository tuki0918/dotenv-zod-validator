import { createErrorMap, fromError } from "zod-validation-error/v4";
import { type ZodType, z } from "zod/v4";

// use custom error map to automatically format messages
// this is optional, but recommended
// without this, zod's native error messages will be used
z.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

function validate<T extends ZodType>(
  schema: T,
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
) {
  try {
    return schema.readonly().parse(env);
  } catch (err) {
    const validationError = fromError(err, {
      prefix: "Invalid environment variables",
    });
    throw validationError;
  }
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
