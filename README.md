# dotenv-zod-validator

`dotenv-zod-validator` is a very lightweight library for validating and transforming environment variables using Zod.

## Installation

```bash
npm install dotenv-validator
```

## Usage

.env

```node
NODE_ENV="development"
PORT="3000"
BOOLEAN_FLAG="true"
```

code

```
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
