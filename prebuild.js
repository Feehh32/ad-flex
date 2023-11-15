const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("ad-flex-database.db");

db.serialize(() => {
  db.run("DELETE FROM clients");
  db.run("DELETE FROM service_notes");
  db.run("DELETE FROM service_details");

  db.close();
});
