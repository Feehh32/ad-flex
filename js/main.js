import { handleFormField } from "./form/formClient.js";

// Animação
if (window.SimpleAnime) {
  new SimpleAnime();
}

// validação do formulário de clientes

const formField = document.querySelectorAll("[data-field]");

formField.forEach((field) => {
  field.addEventListener("blur", () => handleFormField(field));
});
