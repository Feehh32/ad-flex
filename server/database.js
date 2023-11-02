const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("ad-flex-database.db");

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email1 TEXT NOT NULL,
    email2 TEXT,
    tel1 TEXT NOT NULL,
    tel2 TEXT,
    charge TEXT
      )
      `);

  // Cria a tabela 'service_notes'
  db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS service_notes (
      id INTEGER PRIMARY KEY,
      client TEXT,
      thickness REAL,
      date TEXT,
      total REAL,
      code TEXT,
      hideMeasure TEXT,
      client_id INTEGER,
      FOREIGN KEY(client_id) REFERENCES clients(id)
    )
  `);
  });

  // Cria a tabela 'service_details'
  db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS service_details (
      id INTEGER PRIMARY KEY,
      note_id INTEGER,
      serviceName TEXT,
      serviceAmount INTEGER,
      width REAL,
      height REAL,
      serviceValue REAL,
      FOREIGN KEY(note_id) REFERENCES service_notes(id)
    )
  `);
  });
});

// Criando gatilho para a exclusão de notas de serviço quando o cliente ao qual ela referencia for excluido

db.run(`
  CREATE TRIGGER IF NOT EXISTS delete_clients_notes
  AFTER DELETE ON clients
  FOR EACH ROW
  BEGIN
  DELETE FROM service_notes WHERE client_id = OLD.id;
  END;
`);

// Criando gatilho para a exclusão dos serviços que pertenciam as notas que foram excluidas com a exclusão dos clientes
db.run(`
  CREATE TRIGGER IF NOT EXISTS delete_service_details
  AFTER DELETE ON service_notes
  FOR EACH ROW
  BEGIN
  DELETE FROM  service_details WHERE note_id = OLD.id;
  END;
`);

module.exports = db;
