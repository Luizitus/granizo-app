// backend/database.js
require('dotenv').config()

// Se tiver DATABASE_URL, usa PostgreSQL (produção)
// Se não tiver, usa SQLite (desenvolvimento local)
if (process.env.DATABASE_URL) {
  const { Pool } = require('pg')

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  // Cria as tabelas no PostgreSQL se não existirem
  const init = async () => {
    const client = await pool.connect()
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS marca (
          id_marca  SERIAL PRIMARY KEY,
          marca     TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS modelo (
          id_modelo SERIAL PRIMARY KEY,
          modelo    TEXT NOT NULL,
          id_marca  INTEGER NOT NULL REFERENCES marca(id_marca)
        );

        CREATE TABLE IF NOT EXISTS cliente (
          id_cliente   SERIAL PRIMARY KEY,
          nome         TEXT NOT NULL,
          endereco     TEXT,
          cidade       TEXT,
          telefone     TEXT NOT NULL,
          contato      TEXT,
          tipo_contato TEXT
        );

        CREATE TABLE IF NOT EXISTS tecnico (
          id_tecnico SERIAL PRIMARY KEY,
          nome       TEXT NOT NULL,
          cidade     TEXT,
          endereco   TEXT,
          telefone   TEXT,
          email      TEXT,
          iban       TEXT
        );

        CREATE TABLE IF NOT EXISTS veiculo (
          id_veiculo        SERIAL PRIMARY KEY,
          placa             TEXT NOT NULL UNIQUE,
          id_cliente        INTEGER NOT NULL REFERENCES cliente(id_cliente),
          id_marca          INTEGER NOT NULL REFERENCES marca(id_marca),
          id_modelo         INTEGER NOT NULL REFERENCES modelo(id_modelo),
          qtde_amassados    INTEGER DEFAULT 0,
          trabalho_a_frio   INTEGER DEFAULT 0,
          pintura           INTEGER DEFAULT 0,
          pecas_para_trocar TEXT,
          id_tecnico        INTEGER REFERENCES tecnico(id_tecnico),
          riscos_amassados  TEXT,
          faturar           INTEGER DEFAULT 0,
          data_chegada_peca TEXT,
          data_troca_peca   TEXT,
          data_pericia      TEXT,
          data_entrada      TEXT NOT NULL,
          data_trabalho     TEXT,
          data_entrega      TEXT,
          status            TEXT NOT NULL DEFAULT 'em_analise'
        );

        CREATE TABLE IF NOT EXISTS fotos (
          id_foto    SERIAL PRIMARY KEY,
          id_veiculo INTEGER NOT NULL REFERENCES veiculo(id_veiculo),
          caminho    TEXT NOT NULL,
          tipo       TEXT DEFAULT 'entrada'
        );

        CREATE TABLE IF NOT EXISTS usuarios (
          id_usuario SERIAL PRIMARY KEY,
          nome       TEXT NOT NULL,
          email      TEXT NOT NULL UNIQUE,
          senha      TEXT NOT NULL,
          perfil     TEXT NOT NULL DEFAULT 'operador'
        );
      `)
      console.log('PostgreSQL conectado e tabelas criadas.')
    } finally {
      client.release()
    }
  }

  init().catch(console.error)

  module.exports = pool

} else {
  // SQLite para desenvolvimento local
  const Database = require('better-sqlite3')
  const path = require('path')

  const db = new Database(path.join(__dirname, 'granizo.db'))
  db.pragma('journal_mode = WAL')

  db.exec(`
    CREATE TABLE IF NOT EXISTS marca (
      id_marca  INTEGER PRIMARY KEY AUTOINCREMENT,
      marca     TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS modelo (
      id_modelo INTEGER PRIMARY KEY AUTOINCREMENT,
      modelo    TEXT NOT NULL,
      id_marca  INTEGER NOT NULL,
      FOREIGN KEY (id_marca) REFERENCES marca(id_marca)
    );
    CREATE TABLE IF NOT EXISTS cliente (
      id_cliente   INTEGER PRIMARY KEY AUTOINCREMENT,
      nome         TEXT NOT NULL,
      endereco     TEXT,
      cidade       TEXT,
      telefone     TEXT NOT NULL,
      contato      TEXT,
      tipo_contato TEXT
    );
    CREATE TABLE IF NOT EXISTS tecnico (
      id_tecnico INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT NOT NULL,
      cidade     TEXT,
      endereco   TEXT,
      telefone   TEXT,
      email      TEXT,
      iban       TEXT
    );
    CREATE TABLE IF NOT EXISTS veiculo (
      id_veiculo        INTEGER PRIMARY KEY AUTOINCREMENT,
      placa             TEXT NOT NULL UNIQUE,
      id_cliente        INTEGER NOT NULL,
      id_marca          INTEGER NOT NULL,
      id_modelo         INTEGER NOT NULL,
      qtde_amassados    INTEGER DEFAULT 0,
      trabalho_a_frio   INTEGER DEFAULT 0,
      pintura           INTEGER DEFAULT 0,
      pecas_para_trocar TEXT,
      id_tecnico        INTEGER,
      riscos_amassados  TEXT,
      faturar           INTEGER DEFAULT 0,
      data_chegada_peca TEXT,
      data_troca_peca   TEXT,
      data_pericia      TEXT,
      data_entrada      TEXT NOT NULL,
      data_trabalho     TEXT,
      data_entrega      TEXT,
      status            TEXT NOT NULL DEFAULT 'em_analise',
      FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
      FOREIGN KEY (id_marca)   REFERENCES marca(id_marca),
      FOREIGN KEY (id_modelo)  REFERENCES modelo(id_modelo),
      FOREIGN KEY (id_tecnico) REFERENCES tecnico(id_tecnico)
    );
    CREATE TABLE IF NOT EXISTS fotos (
      id_foto    INTEGER PRIMARY KEY AUTOINCREMENT,
      id_veiculo INTEGER NOT NULL,
      caminho    TEXT NOT NULL,
      tipo       TEXT DEFAULT 'entrada',
      FOREIGN KEY (id_veiculo) REFERENCES veiculo(id_veiculo)
    );
    CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT NOT NULL,
      email      TEXT NOT NULL UNIQUE,
      senha      TEXT NOT NULL,
      perfil     TEXT NOT NULL DEFAULT 'operador'
    );
  `)

  console.log('SQLite conectado e tabelas criadas.')
  module.exports = db
}