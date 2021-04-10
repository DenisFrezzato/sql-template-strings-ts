Functional wrapper for [`sql-template-strings`](https://github.com/felixfbecker/node-sql-template-strings) module. The goal of this library is to expose a `pipe` friendly API.

# Install

```sh
$ npm i sql-template-strings sql-template-strings-ts
```

# Documentation

## `t`

```ts
declare const t: (strings: TemplateStringsArray, ...values: unknown[]) => SQLStatement
``` 

The template string tag.

Example:

```ts
import * as SQL from 'sql-template-strings-ts'
import { pipe } from 'fp-ts/function'

declare const book: string
declare const author: string
const query = SQL.t`
  SELECT author FROM books
  WHERE name = ${book} AND author = ${author}`
```

## `append`

```ts
declare const append: (statement: SQLStatement | string | number) => (sql: SQLStatement) => SQLStatement
```
Appends a string or another statement.

Example:

```ts
import * as SQL from 'sql-template-strings-ts'
import { identity, pipe } from 'fp-ts/function'

declare const name: string | undefined
declare const offset: number
const query = pipe(
  SQL.t`SELECT * FROM books`,
  name ? SQL.append(SQL.t` WHERE name = ${name}`) : identity,
  SQL.append(SQL.t` LIMIT 10 OFFSET ${offset}`),
) 
```

## `setName`

```ts
declare const setName: (name: string) => (sql: SQLStatement) => SQLStatement
```

Sets the name property of this statement for prepared statements in PostgreSQL.

## `useBind`

```ts
declare const useBind: (bind: boolean) => (sql: SQLStatement) => SQLStatement
```

Use a prepared statement with Sequelize. Makes `query` return a query with `$n` syntax instead of `?` and switches the `values` key name to `bind`.

---

Please refer to [`sql-template-strings`](https://github.com/felixfbecker/node-sql-template-strings) documentation for further details.
