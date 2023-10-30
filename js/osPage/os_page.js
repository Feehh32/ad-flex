import { os, urlOs, handleServiceDetails } from "../main.js";
import { deleteOs } from "./osActions.js";

// Criando a ordem de serviço

const getClientFromName = () => {
  const paramsUrl = new URLSearchParams(window.location.search);
  const clientFromUrl = {
    name: paramsUrl.get("client"),
    id: paramsUrl.get("id"),
  };

  return clientFromUrl;
};

const clientFromUrl = getClientFromName();
const osTitle = document.querySelector("[data-titleOs] span");
const osWrapper = document.querySelector("[data-os]");
const btn = document.querySelectorAll("[data-buttonOs]");
const mainTitle = document.querySelector("[data-titleOs]");
const emptyPageOs = `<p class="font-r-xl color-3 msgOsDeleted">Sua nota de serviço foi excluida com sucesso!</p>
<a href="./" class="font-r-m-b color-prim1 linkOsDeleted">voltar para a página principal</a>`;
const filteredOs = os.find(
  (os) =>
    os.client === clientFromUrl.name && os.id === parseFloat(clientFromUrl.id)
);

let service = "";

if (filteredOs) {
  service = await handleServiceDetails(filteredOs.id);
}

// Criando uma mascara para a exibição de valores monetários

const monetaryMask = (value) => {
  const valueTotal = value * 100;
  const valueFiltered = (valueTotal / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return valueFiltered;
};

// Inserindo as ações do botão

btn.forEach((btn) => {
  if (btn.innerText.includes("EXCLUIR")) {
    btn.addEventListener("click", async () => {
      const userConfirm = window.confirm(
        "Tem certeza que deseja apagar este cliente definitivamente."
      );
      if (userConfirm) {
        await deleteOs(urlOs, filteredOs.id);
      }
    });
  }

  if (btn.innerText.includes("IMPRIMIR")) {
    btn.addEventListener("click", () => {
      window.print();
    });
  }
});

if (filteredOs) {
  osTitle.innerHTML = filteredOs.id;
  osWrapper.innerHTML = `
      <div class="os__header">
      <div class="os__logo--container">
          <img class="os__logo" src="./img/icones/logo-os.svg" width="100" height="32"
              alt="Logo da ordem de serviço">
      </div>
      <h2 class="os__title font-os-xl-b">Ordem de serviço</h2>
      <span class="os__code font-os-s-b">O.S: ${filteredOs.code}</span>
      <p class="os__email font-os-xs color-11">adm.xavier@hotmail.com</p>
      <p class="os__tel font-os-xs color-11">(11) 94285-8422</p>
      <p class="os__adress font-os-xxs color-11">Avenida Doutor Felipe Pinel, 500
          Jaraguá - São Paulo - SP - Cep: 05181-660</p>
      </div>
      <div class="os__client position__os">
      <div>
          <span class="font-os-xxs">Cliente:</span>
          <p class="font-os-s-b">${filteredOs.client}</p>
      </div>
      <p class="font-os-s-b ">${filteredOs.date}</p>
      </div>
      <div class="os__thickness position__os">
      <span class="font-os-xxs color-11">Espessura:</span>
      <p class="font-os-s-b">${filteredOs.thickness}</p>
      </div>
      <div class="os__itens position__os">
      <p class="font-os-s-b ">Quant.</p>
      <p class="font-os-s-b ">Medidas</p>
      <p class="font-os-s-b ">Serviços</p>
      <p class="font-os-s-b ">Total</p>
      </div>
      <div class="os__content" data-serviceValues>
      </div>
      <div class="os__payment">
      <p class="font-os-m">Valor total do pedido:</p>
      <p class="font-os-m-b">${monetaryMask(filteredOs.total)}</p>
      </div>
      <div class="os__signature">
      <p class="font-os-xs">Visto:</p>
      </div>
  `;

  const handleMeasure = (element) => {
    let showMeasure = "";

    if (filteredOs.hideMeasure === "sim") {
      showMeasure = `##/##`;
    } else {
      showMeasure = `${element.height} / ${element.width}`;
    }
    return showMeasure;
  };

  const serviceValues = document.querySelector("[data-serviceValues]");
  service.forEach((element) => {
    const measures = handleMeasure(element);
    serviceValues.innerHTML += `
      <ul class="content__values font-os-xs-b">
          <li>${element.serviceAmount}</li>
          <li>${measures}</li>
          <li>${element.serviceName}</li>
          <li>${monetaryMask(element.serviceValue)}</li>
      </ul>
    `;
  });
} else {
  mainTitle.innerHTML = "";
  osWrapper.style.backgroundColor = "transparent";
  osWrapper.style.boxShadow = "none";
  osWrapper.innerHTML = emptyPageOs;
  btn.forEach((btn) => {
    btn.style.display = "none";
  });
}
