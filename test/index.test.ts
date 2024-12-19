import { zenv } from "../src";

describe("zenv.validate", () => {
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

describe("zenv.string", () => {
  const schema = zenv.object({
    SITE_NAME: zenv.string(),
  });

  test.each([
    ["", ""],
    ["0", "0"],
    ["invalid_text", "invalid_text"],
    ["true", "true"],
  ])('"%s" to "%s"', (v, expected) => {
    const env = { SITE_NAME: v };
    const result = zenv.validate(schema, env);
    expect(result).toEqual({ SITE_NAME: expected });
  });

  test.each([[undefined]])('"%s" to throw an error', (v) => {
    const env = { SITE_NAME: v };
    expect(() => zenv.validate(schema, env)).toThrow(
      "Invalid environment variables",
    );
  });
});

describe("zenv.enum", () => {
  const schema = zenv.object({
    VALUE: zenv.enum(["development", "production", "test"]),
  });

  test.each([
    ["development", "development"],
    ["production", "production"],
    ["test", "test"],
  ])('"%s" to "%s"', (v, expected) => {
    const env = { VALUE: v };
    const result = zenv.validate(schema, env);
    expect(result).toEqual({ VALUE: expected });
  });

  test.each([["invalid_text"], [""], [undefined]])(
    '"%s" to throw an error',
    (v) => {
      const env = { VALUE: v };
      expect(() => zenv.validate(schema, env)).toThrow(
        "Invalid environment variables",
      );
    },
  );
});

describe("zenv.number", () => {
  const schema = zenv.object({
    VALUE: zenv.number(),
  });

  test.each([
    ["0", 0],
    ["1", 1],
    ["99", 99],
  ])('"%s" to %s', (v, expected) => {
    const env = { VALUE: v };
    const result = zenv.validate(schema, env);
    expect(result).toEqual({ VALUE: expected });
  });

  test.each([["-1"], [""], [undefined]])('"%s" to throw an error', (v) => {
    const env = { VALUE: v };
    expect(() => zenv.validate(schema, env)).toThrow(
      "Invalid environment variables",
    );
  });
});

describe("zenv.boolean", () => {
  const schema = zenv.object({
    VALUE: zenv.boolean(),
  });

  test.each([
    ["1", true],
    ["true", true],
    ["-1", false],
    ["0", false],
    ["2", false],
    ["invalid_text", false],
  ])('"%s" to %s', (v, expected) => {
    const env = { VALUE: v };
    const result = zenv.validate(schema, env);
    expect(result).toEqual({ VALUE: expected });
  });

  test.each([[""], [undefined]])('"%s" to throw an error', (v) => {
    const env = { VALUE: v };
    expect(() => zenv.validate(schema, env)).toThrow(
      "Invalid environment variables",
    );
  });
});