const express = require("express");
const path = require("path");
const { app: appElectron } = require("electron");

const pathReceived = appElectron.getAppPath();
const app = express();
const dbPath = path.join(pathReceived, "database", "database.js");
const db = require(dbPath);
const port = 3000;

function serverStart(electronApp) {
  app.use(express.json());
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });

  // buscando clientes no banco de dados
  app.get("/clients", (req, res) => {
    db.all("SELECT * FROM clients", (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ clients: rows });
    });
  });

  // Inserir os dados do cliente no banco de dados
  app.post("/clients", (req, res, next) => {
    const { name, email1, email2, tel1, tel2, charge } = req.body.clients;

    db.run(
      "INSERT INTO clients (name, email1, email2, tel1, tel2, charge) VALUES (?,?,?,?,?,?)",
      [name, email1, email2, tel1, tel2, charge],
      function (err) {
        if (err) {
          return next(err);
        }
        res.json({ id: this.lastID });
      }
    );
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: err.message });
  });

  // Atualizar os dados do cliente
  app.put("/clients/:id", (req, res) => {
    const clientId = req.params.id;
    const { name, email1, email2, tel1, tel2, charge } = req.body;

    db.run(
      "UPDATE clients SET name = ?, email1 = ?, email2 = ?, tel1 = ?, tel2 = ?, charge = ? WHERE id = ?",
      [name, email1, email2, tel1, tel2, charge, clientId],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Cliente atualizado com sucesso" });
      }
    );
  });

  // Deletar dados do cliente

  app.delete("/clients/:id", (req, res) => {
    const clientId = req.params.id;

    db.get("SELECT * FROM clients WHERE id = ?", [clientId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(404).json({ error: "Cliente não encontrado." });
      }

      db.run("DELETE FROM clients WHERE id = ?", [clientId], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Cliente excluido com sucesso" });
      });
    });
  });

  // buscando notas de serviço no banco de dados

  app.get("/os", (req, res) => {
    db.all("SELECT * FROM service_notes", (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ os: rows });
    });
  });

  // Inserir nota de serviço baseado no cliente descrito na nota
  app.post("/os", (req, res) => {
    if (!req.body || !req.body.os) {
      return res.status(400).json({ error: "Corpo da solicitação inválido" });
    }
    const { client, hideMeasure, thickness, service, date, total } =
      req.body.os;

    // Obtenha o último código gerado para este cliente
    db.get("SELECT id FROM clients WHERE name = ?", [client], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      const clientId = row.id;

      db.get(
        "SELECT code FROM service_notes WHERE client_id = ? ORDER BY id DESC LIMIT 1",
        [clientId],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          let nextCode;
          if (row) {
            const lastCode = row.code;
            const lastMonth = date.split("de")[1].replace(/\s/g, "");
            const monthNumber = new Date().getMonth();
            const monthNames = [
              "janeiro",
              "fevereiro",
              "março",
              "abril",
              "maio",
              "junho",
              "julho",
              "agosto",
              "setembro",
              "outubro",
              "novembro",
              "dezembro",
            ];

            const currentMonth = monthNames[monthNumber];
            if (lastMonth === currentMonth) {
              nextCode = (parseInt(lastCode) + 1).toString().padStart(3, "0");
            } else {
              nextCode = "001";
            }
          } else {
            nextCode = "001";
          }

          db.get(
            "SELECT id FROM clients WHERE name = ?",
            [client],
            (err, row) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              if (!row) {
                return res
                  .status(404)
                  .json({ error: "Cliente não encontrado" });
              }

              const clientId = row.id;

              db.run(
                "INSERT INTO service_notes (client, client_id, code, hideMeasure, thickness, date, total) VALUES (?,?,?,?,?,?,?)",
                [
                  client,
                  clientId,
                  nextCode,
                  hideMeasure,
                  thickness,
                  date,
                  total,
                ],
                function (err) {
                  if (err) {
                    return res.status(500).json({ error: err.message });
                  }

                  const noteId = this.lastID;

                  service.forEach((detail) => {
                    db.run(
                      "INSERT INTO service_details(note_id, serviceName, serviceAmount, width, height, serviceValue) VALUES(?,?,?,?,?,?)",
                      [
                        noteId,
                        detail.serviceName,
                        detail.serviceAmount,
                        detail.width,
                        detail.height,
                        detail.serviceValue,
                      ],
                      function (err) {
                        if (err) {
                          return res.status(500).json({ error: err.message });
                        }
                      }
                    );
                  });

                  res.json({ id: noteId });
                }
              );
            }
          );
        }
      );
    });
  });

  // Deletando as notas de serviço

  app.delete("/os/:id", (req, res) => {
    const noteId = req.params.id;

    db.get("SELECT * FROM service_notes WHERE id = ?", [noteId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res
          .status(404)
          .json({ error: "Nota de serviço não encontrada." });
      }
      db.run(
        "DELETE FROM service_details WHERE note_id = ?",
        [noteId],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          db.run(
            "DELETE FROM service_notes WHERE id = ?",
            [noteId],
            function (err) {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              if (this.changes === 0) {
                return res
                  .status(500)
                  .json({ error: "Nota de serviço não encontrada" });
              }

              res.json({ message: "Nota de serviço excluida com sucesso" });
            }
          );
        }
      );
    });
  });

  // Consultando os serviços da nota de serviço
  app.get("/service_details/:noteId", (req, res) => {
    const noteId = req.params.noteId;

    db.all(
      "SELECT * FROM service_details WHERE note_id = ?",
      [noteId],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        res.json({ data: rows });
      }
    );
  });

  // Buscando todos os serviços
  app.get("/service_details", (req, res) => {
    db.all("SELECT * FROM service_details", (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ data: rows });
    });
  });
}

module.exports = serverStart;
