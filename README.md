# dotenv-zod-validator

<p>
<a href="https://www.npmjs.com/package/dotenv-zod-validator"><img src="https://img.shields.io/npm/v/dotenv-zod-validator"></a>
</p>

`dotenv-zod-validator` is a very lightweight library for validating and transforming environment variables using Zod.

## Installation

```bash
npm install dotenv-zod-validator
```

## Usage

.env

```bash
NODE_ENV="development"
PORT="3000"
BOOLEAN_FLAG="true"
```

code

```typescript
import { zenv } from "dotenv-zod-validator";

const schema = zenv.object({
    NODE_ENV: zenv.enum(["development", "production", "test"]),
    PORT: zenv.number(),
    OPTIONAL_VAR: zenv.string().optional(),
    BOOLEAN_FLAG: zenv.boolean(),
});

const env = zenv.validate(schema);
// NODE_ENV: "development"
// PORT: 3000
// BOOLEAN_FLAG: true
```

<details>

<summary>Next.js</summary>

file: utils/dotenv.public.ts

```typescript
import { zenv } from "dotenv-zod-validator";

export const schema = zenv.object({
    NEXT_PUBLIC_MY_VALUE: zenv.string(),
});

export const env = zenv.validate(schema, {
    NEXT_PUBLIC_MY_VALUE: process.env.NEXT_PUBLIC_MY_VALUE,
});
```

file: utils/dotenv.ts

```typescript
import { zenv } from "dotenv-zod-validator";
import { schema as publicSchema } from "@/utils/dotenv.public";

const schema = zenv.object({
    MY_SECRET: zenv.string(),
});

export const env = zenv.validate(publicSchema.merge(schema));
```

</details>

## Custom Schemas

| Method | Description |
| ---- | ---- |
| object | Alias for `z.object` |
| enum | Alias for `z.enum` |
| string | Alias for `z.string` |
| number | Converts to a number and validates as a non-negative integer. |
| boolean | Converts to a boolean. (TRUE: `true`, `1` / FALSE: `other`) |

## Tests

```
npm run test
```


## License

MIT License
