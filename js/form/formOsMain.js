import {
  select,
  handleServiceAmount,
  handleFormField,
  showMessage,
} from "./formOs.js";
import { clients, urlOs } from "../main.js";

const formOs = document.querySelector("[data-formOs]");
const btnServiceAmount = document.querySelector("[data-btnServiceAmount]");
const serviceItems = document.querySelectorAll("[data-serviceItem]");

// lidando com o form

const handleForm = async (data) => {
  try {
    const connection = await fetch(urlOs, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!connection.ok) {
      throw new Error("Erro na requisição:" + connection.statusText);
    }
    const connectionConverted = await connection.json();
    showMessage(formOs, "Sua OS foi adicionada com sucesso!");
    return connectionConverted;
  } catch (error) {
    console.error(error);
  }
};

const handleService = (e) => {
  const servicesArray = [];
  const services = document.querySelectorAll(".service");

  let i = 0;

  while (i < services.length) {
    const serviceName = e.target.elements[`serviceName${i}`].value;
    const serviceAmount = e.target.elements[`serviceAmount${i}`].value;
    const width = e.target.elements[`width${i}`].value;
    const height = e.target.elements[`height${i}`].value;

    const serviceObj = {
      serviceName,
      serviceAmount,
      width,
      height,
    };
    servicesArray.push(serviceObj);
    i++;
  }

  const currentDate = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("pt-BR", options);

  const listAnswers = {
    client: e.target.elements["client"].value,
    thickness: e.target.elements["thickness"].value,
    service: servicesArray,
    date: formattedDate,
  };

  return listAnswers;
};

formOs.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = handleService(e);

  if (clients.some((client) => client.nameClient === data.client)) {
    handleForm(data);
  } else {
    showMessage(
      formOs,
      "O cliente citado nesta OS ainda não existe, cadastre primeiro o cliente!"
    );
  }
});

// lidando com o acrescimo dos campos de serviço no formulário

let fieldList = [...serviceItems];
fieldList.push(select);

btnServiceAmount.addEventListener("click", () => {
  handleServiceAmount();
  const serviceItems = document.querySelectorAll("[data-serviceItem]");
  fieldList = [...serviceItems];
  fieldList.forEach((field) =>
    field.addEventListener("blur", (e) => handleFormField(e.target))
  );
});

fieldList.forEach((field) =>
  field.addEventListener("blur", (e) => handleFormField(e.target))
);
