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

const ENV = zenv.validate(schema);
// NODE_ENV: "development"
// PORT: 3000
// BOOLEAN_FLAG: true

// Cannot assign to 'NODE_ENV' because it is a read-only property.
// ENV.NODE_ENV = "production"
```

<details>

<summary>Next.js</summary>

file: utils/dotenv.public.ts

```typescript
import { zenv } from "dotenv-zod-validator";

export const schema = zenv.object({
    NEXT_PUBLIC_MY_VALUE: zenv.string(),
});

export const ENV = zenv.validate(schema, {
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

export const ENV = zenv.validate(publicSchema.merge(schema));
```

</details>

## Custom Helpers

| Method | Description | undefined | empty | and error |
| ---- | ---- | ---- | ---- | ---- |
| object | Alias for `z.object` | _ | _ | _ |
| enum | Alias for `z.enum` | ❌️ | ❌️ | `invalid text` |
| string | Alias for `z.string` | ❌️ | ✅️ | _ |
| number | Converts to a number and validates as a non-negative integer. | ❌️ | ❌️ | `-1`, `1.1`, `invalid number` |
| boolean | Converts to a boolean. (TRUE: `true`, `TRUE`, `1` / FALSE: `other`) | ❌️ | ❌️ | _ |

## Tests

```
npm run test
```


## License

MIT License
