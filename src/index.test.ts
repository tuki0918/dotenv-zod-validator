import { describe, expect, it } from "vitest";
import { zenv } from ".";

describe("validateEnv", () => {
  it("should validate correct environment variables", () => {
    const schema = zenv.object({
      PORT: zenv.number(),
      DEBUG_MODE: zenv.boolean(),
      APP_ENV: zenv.enum(["development", "production", "test"]),
    });

    const env = {
      PORT: "3000",
      DEBUG_MODE: "true",
      APP_ENV: "development",
    };

    const result = zenv.validate(schema, env);

    expect(result).toEqual({
      PORT: 3000,
      DEBUG_MODE: true,
      APP_ENV: "development",
    });
  });

  it("should throw an error for invalid environment variables", () => {
    const schema = zenv.object({
      PORT: zenv.number(),
      DEBUG_MODE: zenv.boolean(),
      APP_ENV: zenv.enum(["development", "production", "test"]),
    });

    const invalidEnv = {
      PORT: "not_a_number",
      DEBUG_MODE: "invalid_boolean",
      APP_ENV: "invalid_env",
    };

    expect(() => zenv.validate(schema, invalidEnv)).toThrow(
      "Invalid environment variables",
    );
  });
});
