import { clients } from "../main.js";

// Preenchendo o select
export const select = document.querySelector("[data-client]");
let counter = 0;

clients.forEach((client) => {
  select.innerHTML += `<option value="${client.nameClient}">${client.nameClient}</option>`;
});

// adicionando o formulário de serviços

export const handleServiceAmount = () => {
  counter++;
  const newService = document.createElement("div");
  const serviceWrapper = document.querySelector("[data-service]");
  newService.classList.add("service");
  newService.innerHTML += `
  <fieldset>
      <label class="font-p-s-b" for="serviceName${counter}">Nome do serviço</label>
      <input class="input-pattern" type="text" name="serviceName" id="serviceName${counter}" data-serviceItem
          required>
      <span class="msgError"></span>
  </fieldset>
  <fieldset>
      <label class="font-p-s-b" for="serviceAmount${counter}">Quantidade de peças</label>
      <input class="input-pattern" type="number" name="serviceAmount" id="serviceAmount${counter}"
          data-serviceItem required>
      <span class="msgError"></span>
  </fieldset>
  <div class="service__measure">
      <label class="font-p-s-b" for="measures${counter}">Medidas</label>
      <fieldset id="measures${counter}" class="measure__container">
          <div>
              <input class="input-pattern inputWidth" type="text" id="width${counter}" name="width"
                   data-serviceItem placeholder="Largura" required>
              <span class="msgError"></span>
          </div>
          <div>
              <input class="input-pattern inputHeight" type="text" id="height${counter}" name="height"
                 data-serviceItem placeholder="Altura" required>
              <span class="msgError"></span>
          </div>
      </fieldset>
  </div>
    `;
  serviceWrapper.appendChild(newService);
};

// validações do formulário

export const handleFormField = (field) => {
  let msg = "";
  field.setCustomValidity("");

  errorsType.forEach((error) => {
    "";
    if (field.validity[error]) {
      msg = msgErrors[field.name][error];
    }
  });

  const errorMsgField = field.parentNode.querySelector(".msgError");
  const verifyInput = field.checkValidity();

  if (!verifyInput) {
    errorMsgField.textContent = msg;
    field.style.border = "2px solid #e70a0a";
  } else {
    errorMsgField.textContent = "";
    field.style.border = "2px solid var(--color-4)";
  }
};

const errorsType = [
  "valueMissing",
  "typeMismatch",
  "tooShort",
  "patternMismatch",
];

const msgErrors = {
  client: {
    valueMissing: "O campo de nome do cliente não pode estar vazio.",
  },
  serviceName: {
    valueMissing: "O campo de nome do serviço não pode estar vazio.",
    tooShort: "Por favor, preencha um nome válido.",
  },
  serviceAmount: {
    valueMissing: "O campo de email não pode estar vazio.",
  },
  width: {
    valueMissing: "O campo de largura não pode estar vazio.",
    patternMismatch:
      "Por favor insira as medidas apenas com números e pontos. Ex:2.5",
  },
  height: {
    valueMissing: "O campo de altura não pode estar vazio.",
    patternMismatch:
      "Por favor insira as medidas apenas com números e pontos. Ex:2.5",
  },
};

// Mensagem de erro enviada pro usuário quando bem sucessido

export const showMessage = (form, textMessage) => {
  const msg = document.querySelector("[data-msg]");
  msg.classList.add("active");
  msg.innerText += textMessage;

  setTimeout(() => {
    msg.classList.remove("active");
    form.reset();
  }, 5000);
};
