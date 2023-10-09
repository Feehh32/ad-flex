// Validações do formulário de clientes

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
  nameClient: {
    valueMissing: "O campo de nome não pode estar vazio.",
    tooShort: "Por favor, preencha um nome válido.",
  },
  email1: {
    valueMissing: "O campo de email não pode estar vazio.",
    tooShort: "Por favor, preencha um email válido.",
    typeMismatch: "Por favor, preencha um email válido",
  },
  email2: {
    tooShort: "Por favor, preencha um email válido.",
    typeMismatch: "Por favor, preencha um email válido",
  },
  tel1: {
    valueMissing: "O campo de telefone não pode estar vazio.",
    patternMismatch: "Por favor forneça um número no formato (XX) XXXXX-XXXX",
  },
  tel2: {
    patternMismatch: "Por favor forneça um número no formato (XX) XXXXX-XXXX",
  },
  charge: {
    valueMissing: "O campo de cobrança não pode estar vazio.",
  },
};

// mensagem de envio de formulário bem sucedido

export const showMessage = (form) => {
  const successMsg = document.querySelector("[data-msg]");
  successMsg.classList.add("active");

  setTimeout(() => {
    successMsg.classList.remove("active");
    form.reset();
  }, 5000);
};
