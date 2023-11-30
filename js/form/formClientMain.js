import { handleFormField, showMessage } from "./formClient.js";
import { urlClients, clients } from "../main.js";

// Lidando com o formulário de clientes

const collectingRegistration = async (formData) => {
  try {
    const connection = await fetch(urlClients, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ clients: formData }),
    });
    console.log(formData);
    if (!connection.ok) {
      throw new Error("Erro na requisição:" + connection.statusText);
    }
    const connectionConverted = await connection.json();
    showMessage(formClients, "Cliente adicionado com sucesso.", "active");
    return connectionConverted;
  } catch (error) {
    console.error(error);
    showMessage(
      formClients,
      "Ocorreu um erro na tentativa de adicionar o cliente, por favor tente novamente",
      "activeError"
    );
  }
};

const formField = document.querySelectorAll("[data-field]");
const formClients = document.querySelector("[data-form]");
let isEditing = false;

formField.forEach((field) => {
  field.addEventListener("blur", (e) => handleFormField(e.target));
});

// Lidando com a url para definir se o form sera para inserir ou editar o cliente

const getParamsUrl = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};

const editingClients = async (clientId, client) => {
  try {
    const response = await fetch(`${urlClients}/${clientId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(client),
    });
    if (!response.ok) {
      throw new Error("Erro na requisição:" + response.statusText);
    } else {
      window.location.href = `client.html?id=${clientId}`;
      return response.json();
    }
  } catch (error) {
    console.error(error);
    showMessage(
      formClients,
      "Ocorreu um erro. Tente novamente.",
      "activeError"
    );
  }
};

const clientIdForEdition = getParamsUrl("editar");

if (clientIdForEdition) {
  isEditing = true;
  const titleForm = document.querySelector("[data-titleForm]");
  const btnForm = document.querySelector("[data-btnForm]");

  btnForm.innerText = "Salvar";
  titleForm.innerHTML = `Edite as informações do cliente<span class="color-prim2">.</span>`;
  const clientEdit = clients.find(
    (client) => client.id === parseFloat(clientIdForEdition)
  );

  formField.forEach((field) => {
    let fieldId = field.id;
    if (fieldId === "nameClient") {
      fieldId = "name";
    }
    field.value = clientEdit[fieldId];
  });
}

// Definindo se a submissão do formulário será de editar ou adicionar o cliente

formClients.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (isEditing) {
    const updatedData = {
      name: event.target.elements["name"].value,
      email1: event.target.elements["email1"].value,
      email2: event.target.elements["email2"].value,
      tel1: event.target.elements["tel1"].value,
      tel2: event.target.elements["tel2"].value,
      charge: parseFloat(event.target.elements["charge"].value),
    };
    await editingClients(clientIdForEdition, updatedData);
  } else {
    const data = {
      name: event.target.elements["name"].value,
      email1: event.target.elements["email1"].value,
      email2: event.target.elements["email2"].value,
      tel1: event.target.elements["tel1"].value,
      tel2: event.target.elements["tel2"].value,
      charge: parseFloat(event.target.elements["charge"].value),
      os: 0,
    };

    if (
      clients.some((client) => {
        const noSpaceClient = client.name.replace(/\s/g, "");
        const noSpaceSearchClient = data.name.replace(/\s/g, "");
        return (
          noSpaceClient.toLowerCase() === noSpaceSearchClient.toLowerCase()
        );
      })
    ) {
      showMessage(
        formClients,
        "Este cliente já foi adicionado no sistema, por favor confira as informações e tente novamente",
        "activeError"
      );
    } else {
      await collectingRegistration(data);
    }
  }
});
