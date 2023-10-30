import {
  select,
  handleServiceAmount,
  handleFormField,
  showMessage,
} from "./formOs.js";
import { clients, urlOs } from "../main.js";

// Inserir funcionalidade de esconder as medidas quando solicitado

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
      body: JSON.stringify({ os: data }),
    });
    if (!connection.ok) {
      throw new Error("Erro na requisição:" + connection.statusText);
    }
    const connectionConverted = await connection.json();
    showMessage(formOs, "Sua OS foi adicionada com sucesso!", "active");
    return connectionConverted;
  } catch (error) {
    console.error(error);
    showMessage(formOs, "Ocorreu um erro. Tente novamente.", "activeError");
  }
};

// Lidando com  os valores de serviço

const handleService = (e) => {
  const servicesArray = [];
  const services = document.querySelectorAll(".service");

  let i = 0;

  while (i < services.length) {
    const serviceName = e.target.elements[`serviceName${i}`].value;
    const serviceAmount = parseFloat(
      e.target.elements[`serviceAmount${i}`].value
    );
    const width = parseFloat(e.target.elements[`width${i}`].value);
    const height = parseFloat(e.target.elements[`height${i}`].value);

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
  const hideMeasure = e.target.querySelector("#hiddenMeasures").checked
    ? "sim"
    : "não";

  const listAnswers = {
    client: e.target.elements["client"].value,
    thickness: e.target.elements["thickness"].value,
    service: servicesArray,
    date: formattedDate,
    hideMeasure: hideMeasure,
    total: 0,
  };

  const clientCharge = clients.find(
    (client) => client.name === listAnswers.client
  );

  for (const service of listAnswers.service) {
    const serviceWidth = service.width;
    const serviceHeight = service.height;
    const serviceAmount = service.serviceAmount;

    service.serviceValue =
      serviceWidth * serviceHeight * clientCharge.charge * serviceAmount;

    listAnswers.total += service.serviceValue;
  }

  return listAnswers;
};

// Evento de escuta para a submissão do formulário

formOs.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = handleService(e);
  if (clients.some((client) => client.name === data.client)) {
    await handleForm(data);
    formOs.reset();
  } else {
    showMessage(
      formOs,
      "O cliente mencionado nesta OS ainda não existe, cadastre primeiro o cliente!",
      "activeError"
    );
  }
});

// lidando com o acrescimo dos campos de serviço no formulário

let fieldList = [...serviceItems];
fieldList.push(select);

btnServiceAmount.addEventListener("click", () => {
  handleServiceAmount();
  const serviceItems = document.querySelectorAll("[data-serviceItem]");
  if (serviceItems.length >= 35) {
    btnServiceAmount.disabled = true;
    showMessage(
      formOs,
      "Número máximo de serviços permitidos alcançados, considere abrir uma nova nota",
      "activeError"
    );
  }
  fieldList = [...serviceItems];
  fieldList.forEach((field) =>
    field.addEventListener("blur", (e) => handleFormField(e.target))
  );
});

fieldList.forEach((field) =>
  field.addEventListener("blur", (e) => handleFormField(e.target))
);

// preechendo automaticamente o nome de cliente se o acesso for pela pagina do cliente

const urlParams = new URLSearchParams(window.location.search);
const clientNameByUrl = urlParams.get("client");

fieldList.forEach((element) => {
  if (element.id === "client") {
    element.value = clientNameByUrl;
  }
});
