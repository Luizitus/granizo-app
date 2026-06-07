//backend/databse.js
const Database = require('better-sqlite3');
const path = require('path');

//Conecta ou cria o arquivo granizo.db nessa pasta
const db = new Database(path.join(__dirname, 'granizo.db'), { verbose: console.log });

//Ativa WAL mode: melhora a performance da escrita
db.pragma('journal_mode = WAL');

//Cria as tabelas -  o IF NOT EXISTS garante que a tabela não seja criada novamente
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
      id_veiculo       INTEGER PRIMARY KEY AUTOINCREMENT,
      placa            TEXT NOT NULL UNIQUE,
      id_cliente       INTEGER NOT NULL,
      id_marca         INTEGER NOT NULL,
      id_modelo        INTEGER NOT NULL,
      qtde_amassados   INTEGER DEFAULT 0,
      trabalho_a_frio  INTEGER DEFAULT 0,
      pintura          INTEGER DEFAULT 0,
      pecas_para_trocar TEXT,
      id_tecnico       INTEGER,
      riscos_amassados TEXT,
      faturar          INTEGER DEFAULT 0,
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
  `);

  console.log('Banco de dados conectado e tabelas criadas.');

  module.exports = db;