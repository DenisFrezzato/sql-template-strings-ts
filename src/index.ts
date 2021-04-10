import SQL_, { SQLStatement as SQLStatement_ } from 'sql-template-strings'

export interface SQLStatement
  extends Pick<SQLStatement_, 'text' | 'query' | 'sql' | 'values' | 'name'> {
  readonly SQLStatement: unique symbol
}

/**
 * The template string tag.
 *
 * @example
 * ```ts
 * import * as SQL from 'spl-template-strings-ts'
 * import { pipe } from 'fp-ts/function'
 *
 * declare const book: string
 * declare const author: string
 * const query = SQL.t`
 *   SELECT author FROM books
 *   WHERE name = ${book} AND author = ${author}`
 * ```
 */
export const t: (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => SQLStatement = SQL_ as any

/**
 * Appends a string or another statement.
 *
 * @example
 * ```ts
 * import * as SQL from 'spl-template-strings-ts'
 * import { identity, pipe } from 'fp-ts/function'
 *
 * declare const name: string | undefined
 * declare const offset: number
 * const query = pipe(
 *   SQL.t`SELECT * FROM books`,
 *   name ? SQL.append(SQL.t` WHERE name = ${name}`) : identity,
 *   SQL.append(SQL.t` LIMIT 10 OFFSET ${offset}`)
 * )
 * ```
 */
export const append = (statement: SQLStatement | string | number) => (
  sql: SQLStatement,
): SQLStatement => (sql as any).append(statement)

/**
 * Sets the name property of this statement for prepared statements in PostgreSQL.
 *
 * @example
 * ```ts
 * import * as SQL from 'spl-template-strings-ts'
 * import { pipe } from 'fp-ts/function'
 *
 * declare const book: string
 * const query = pipe(
 *   SQL.t`SELECT author FROM books WHERE name = ${book}`,
 *   SQL.setName('my_query')
 *)
 * ```
 */
export const setName = (name: string) => (sql: SQLStatement): SQLStatement =>
  (sql as any).setName(name)

/**
 * Use a prepared statement with Sequelize.
 * Makes `query` return a query with `$n` syntax instead of `?` and switches the `values`
 * key name to `bind`.
 */
export const useBind = (bind: boolean) => (sql: SQLStatement): SQLStatement =>
  (sql as any).useBind(bind)
