import { clients, os, serviceArray } from "./main.js";

// captura o id contido na url

const getClientFromId = () => {
  const paramsUrl = new URLSearchParams(window.location.search);
  return paramsUrl.get("id");
};

// encontra o cliente baseado no id retirado da os

const findClientToId = (clientId) => {
  return clients.find((client) => client.id === parseInt(clientId));
};

// funçao de busca de os baseado nos parametros de data, código ou nome de serviço

const searchOs = (filteredOs, filteredService) => {
  const allOsClient = os.filter((os) => os.client === client.name);
  const search = osSearch.value;
  const noteIdsInService = filteredService.filter((service) =>
    service.serviceName.toLowerCase().includes(search.toLowerCase())
  );
  let osFound = allOsClient.filter((os) => {
    return allOsClient
      ? os.code.toLowerCase().includes(search.toLowerCase()) ||
          os.date.toLowerCase().includes(search.toLowerCase())
      : false;
  });
  osFound = osFound.concat(
    ...noteIdsInService.map((service) =>
      filteredOs.filter((os) => os.id === service.note_id)
    )
  );
  return osFound;
};

// Filtra as os para a exibição correta na tela baseada no mês e no cliente
const filterOs = () => {
  const currentDate = new Date();
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
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = String(currentDate.getFullYear());

  const filteredOs = os.filter((os) => {
    const osMonth = os.date.split(" de ")[1].toLowerCase();
    const osYear = os.date.split(" de ")[2].toLowerCase();
    return (
      osMonth === currentMonth &&
      osYear === currentYear &&
      os.client === client.name
    );
  });

  return filteredOs;
};

// exibe os campos das os

const displayOs = () => {
  osField.innerHTML = "";

  if (isFilterActive) {
    const osFound = searchOs(filteredOs, filteredService);
    if (filteredOs.length > 0) {
      osFound.forEach((os) => {
        osField.innerHTML += `
            <li>
              <a href="./os_page.html?id=${os.id}&client=${os.client}"> 
                <span class="font-r-l-b">${os.code}</span>
                <p class="font-r-l-b">${os.date}</p>
              </a>
            </li>
        `;
      });
    } else {
      osField.innerHTML += `  <li><p class="font-p-m-b color-8">Nenhuma os cadastrada.</p></li>`;
    }
  } else {
    if (filteredOs.length > 0) {
      filteredOs.forEach((os) => {
        osField.innerHTML += `
            <li>
              <a href="./os_page.html?id=${os.id}&client=${os.client}"> 
                <span class="font-r-l-b">${os.code}</span>
                <p class="font-r-l-b">${os.date}</p>
              </a>
            </li>
        `;
      });
    } else {
      osField.innerHTML += `  <li><p class="font-p-m-b color-8">Nenhuma os cadastrada.</p></li>`;
    }
  }
};

const clientId = getClientFromId();
const client = findClientToId(clientId);
const filteredOs = filterOs();
let isFilterActive = false;
const noteIds = filteredOs.map((os) => os.id);
const filteredService = serviceArray.filter((service) =>
  noteIds.includes(service.note_id)
);
const seeAllLink = document.createElement("a");
const clientMainInformation = document.querySelector("[data-mainClient]");
const osField = document.querySelector("[data-osField]");
const osSearch = document.querySelector("[data-osSearch]");
const clientOsContainer = document.querySelector("[data-clientOsContainer]");

if (client) {
  clientMainInformation.innerHTML = ` 
    <div class="client-header">
    <h1 class="main__title" >${client.name}</h1>
    <a class="font-p-m-b color-0 "  href="./form_os.html?client=${
      client.name
    }">Inserir nova O.S</a>
    </div>
    <ul class="client-information " >
    <li class="font-r-s color-3">email 1: <a class="font-r-m-b color-1"
        href="mailto:${client.email1}">${client.email1}</a></li>
    <li class="font-r-s color-3">email 2: <a class="font-r-m-b color-1"
        href="mailto:${client.email2}">${client.email2}</a></li>
    <li class="font-r-s color-3">telefone 1: 
    <a class="font-r-m-b color-1" href="tel:+55${client.tel1}">+55 ${
    client.tel1
  }</a></li>
    <li class="font-r-s color-3">telefone 2: <a class="font-r-m-b color-1" 
    href="tel:${client.tel2 ? +55 : ""}${client.tel2}">
    ${client.tel2 ? +55 : ""} ${client.tel2}</a></li>
    <li class="font-r-s color-3">Cálculo de cobrança: <span class="font-r-m-b color-1">${
      client.charge
    }</span></li>
    </ul>
    <span class="client__edit">
    <a href="form_client.html?editar=${
      client.id
    }" class="font-r-s color-4">editar Informações</a>
    </span>
    `;
} else {
  clientMainInformation.innerHTML += `<h3>Não há clientes</h3>`;
}

// Construindo o link ver mais e passando os parametros com o nome do cliente para a url

seeAllLink.classList.add("font-r-l", "see-all__link");
seeAllLink.textContent = "Ver tudo";
seeAllLink.href = `./all_os_for_client.html?name=${client.name}`;
clientOsContainer.appendChild(seeAllLink);

osSearch.addEventListener("input", () => {
  const searchValue = osSearch.value.trim();

  if (searchValue === "") {
    isFilterActive = false;
  } else {
    isFilterActive = true;
  }

  displayOs();
});
displayOs();
