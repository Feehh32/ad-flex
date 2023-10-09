import { handleFormField, showMessage } from "./formClient.js";
import { urlClients } from "../main.js";

// Lidando com o formulário de clientes

const collectingRegistration = async (formData) => {
  try {
    const connection = await fetch(urlClients, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!connection.ok) {
      throw new Error("Erro na requisição:" + connection.statusText);
    }
    const connectionConverted = await connection.json();
    showMessage(formClients);
    return connectionConverted;
  } catch (error) {
    console.error(error);
  }
};

const formField = document.querySelectorAll("[data-field]");
const formClients = document.querySelector("[data-form]");

formField.forEach((field) => {
  field.addEventListener("blur", (e) => handleFormField(e.target));
});

formClients.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(formClients);
  const data = Object.fromEntries(formData);
  await collectingRegistration(data);
});
