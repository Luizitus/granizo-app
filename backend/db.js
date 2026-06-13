// backend/db.js
require('dotenv').config()

const isPg = !!process.env.DATABASE_URL
const db = require('./database')

const query = async (sql, params = []) => {
  if (isPg) {
    let i = 0
    const pgSql = sql.replace(/\?/g, () => `$${++i}`)
    const result = await db.query(pgSql, params)
    return result.rows
  } else {
    const stmt = db.prepare(sql)
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.all(...params)
    } else {
      return stmt.run(...params)
    }
  }
}

const queryOne = async (sql, params = []) => {
  if (isPg) {
    const rows = await query(sql, params)
    return rows[0] || null
  }
  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    const stmt = db.prepare(sql)
    return stmt.get(...params)
  }
  return query(sql, params)
}

const execute = async (sql, params = []) => {
  if (isPg) {
    let i = 0
    const pgSql = sql.replace(/\?/g, () => `$${++i}`)
    const result = await db.query(pgSql, params)
    return {
      lastInsertRowid: result.rows[0]?.id_marca ||
                       result.rows[0]?.id_modelo ||
                       result.rows[0]?.id_cliente ||
                       result.rows[0]?.id_tecnico ||
                       result.rows[0]?.id_veiculo ||
                       result.rows[0]?.id_foto ||
                       result.rows[0]?.id_usuario,
      changes: result.rowCount
    }
  } else {
    const stmt = db.prepare(sql)
    return stmt.run(...params)
  }
}

module.exports = { query, queryOne, execute, isPg }