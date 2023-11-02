import { clients, os, serviceArray } from "./main.js";

const getClientFromId = () => {
  const paramsUrl = new URLSearchParams(window.location.search);
  return paramsUrl.get("id");
};

const findClientToId = (clientId) => {
  return clients.find((client) => client.id === parseInt(clientId));
};

const filterOs = (filteredOs, filteredService) => {
  const search = osSearch.value;
  const noteIdsInService = filteredService.filter((service) =>
    service.serviceName.toLowerCase().includes(search.toLowerCase())
  );
  let osFound = filteredOs.filter((os) => {
    return filteredOs
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

const displayOs = () => {
  osField.innerHTML = "";

  if (isFilterActive) {
    const osFound = filterOs(filteredOs, filteredService);
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
const filteredOs = os.filter((os) => os.client === client.name);
let isFilterActive = false;
const clientMainInformation = document.querySelector("[data-mainClient]");
const osField = document.querySelector("[data-osField]");
const osSearch = document.querySelector("[data-osSearch]");
const noteIds = filteredOs.map((os) => os.id);
const filteredService = serviceArray.filter((service) =>
  noteIds.includes(service.note_id)
);

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
    <a href="../../form_client.html?editar=${
      client.id
    }" class="font-r-s color-4">editar Informações</a>
    </span>
    `;
} else {
  clientMainInformation.innerHTML += `<h3>Não há clientes</h3>`;
}

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
