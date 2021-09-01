import test, { ExecutionContext } from 'ava'
import * as A from 'fp-ts/ReadonlyArray'
import { identity, pipe, unsafeCoerce } from 'fp-ts/function'
import SQL_, { SQLStatement } from 'sql-template-strings'
import * as SQL from '../src'

const unwrap: (sql: SQL.SQLStatement) => SQLStatement = unsafeCoerce

const assertStatement = (
  t: ExecutionContext,
  sql: SQL.SQLStatement,
  expectedSql: SQLStatement,
) => {
  t.deepEqual(unwrap(sql), expectedSql)
}

test('SQLStatement', (t) => {
  const sql = SQL.t`SELECT * FROM table WHERE column = ${42}`
  const expectedSql = SQL_`SELECT * FROM table WHERE column = ${42}`

  assertStatement(t, sql, expectedSql)
})

test('append string', (t) => {
  const sql = pipe(
    SQL.t`SELECT * FROM table WHERE column = ${42}`,
    SQL.append(` LIMIT 1`),
  )
  const expectedSql = SQL_`SELECT * FROM table WHERE column = ${42}`
  expectedSql.append(SQL_` LIMIT 1`)

  assertStatement(t, sql, expectedSql)
})

test('append statement', (t) => {
  const xs = ['a', 'b', 'c']

  const baseSql = SQL.t`INSERT INTO table (column) VALUES `
  const sql = pipe(
    xs,
    A.reduceWithIndex(baseSql, (i, acc, x) =>
      pipe(
        acc,
        i === 0 ? identity : SQL.append(', '),
        SQL.append(SQL.t`(${x})`),
      ),
    ),
    SQL.append(' ORDER BY other_column'),
  )

  const expectedSql = SQL_`INSERT INTO table (column) VALUES `
  xs.forEach((x, i) => {
    if (i !== 0) expectedSql.append(', ')
    expectedSql.append(SQL_`(${x})`)
  })
  expectedSql.append(' ORDER BY other_column')

  assertStatement(t, sql, expectedSql)
})

test("append doesn't mutate the statement", (t) => {
  const baseSql = SQL.t`SELECT * FROM `
  SQL.append('table')(baseSql)
  const expectedSql = SQL.t`SELECT * FROM `

  t.deepEqual(baseSql, expectedSql)
})

test('useBind', (t) => {
  const sql = pipe(
    SQL.t`SELECT * FROM table WHERE column = ${42}`,
    SQL.useBind(true),
  )
  const expectedSql = SQL_`SELECT * FROM table WHERE column = ${42}`
  expectedSql.useBind(true)

  assertStatement(t, sql, expectedSql)
})

test("useBind doesn't mutate the statement", (t) => {
  const baseSql = SQL.t`SELECT * FROM table WHERE column = ${42}`
  SQL.useBind(true)(baseSql)
  const expectedSql = SQL.t`SELECT * FROM table WHERE column = ${42}`

  t.deepEqual(baseSql, expectedSql)
})

test('setName', (t) => {
  const name = 'an awesome name'
  const sql = pipe(
    SQL.t`SELECT * FROM table WHERE column = ${42}`,
    SQL.setName(name),
  )
  const expectedSql = SQL_`SELECT * FROM table WHERE column = ${42}`
  expectedSql.setName(name)

  assertStatement(t, sql, expectedSql)
})

test("setName doesn't mutate the statement", (t) => {
  const baseSql = SQL.t`SELECT * FROM table WHERE column = ${42}`
  SQL.setName('nice name')(baseSql)
  const expectedSql = SQL.t`SELECT * FROM table WHERE column = ${42}`

  t.deepEqual(baseSql, expectedSql)
})

test('Semigroup', (t) => {
  const sql = SQL.Semigroup.concat(
    SQL.t`SELECT * FROM table `,
    SQL.t`WHERE column = ${42}`,
  )
  t.deepEqual(sql, SQL.t`SELECT * FROM table WHERE column = ${42}`)
})

test('Monoid', (t) => {
  t.deepEqual(SQL.Monoid.empty, SQL.t``)

  const sql = SQL.Monoid.concat(
    SQL.t`SELECT * FROM table `,
    SQL.t`WHERE column = ${42}`,
  )
  t.deepEqual(sql, SQL.t`SELECT * FROM table WHERE column = ${42}`)
})
