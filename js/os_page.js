import { os, urlClients, urlOs } from "./main.js";

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

// Criando uma mascara para a exibição de valores monetários

const monetaryMask = (value) => {
  const valueTotal = value * 100;
  const valueFiltered = (valueTotal / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return valueFiltered;
};

// Criando a exclusão da nota de serviço

const deleteOs = async (osId) => {
  try {
    const response = await fetch(`${urlOs}/${osId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      showMessage("activeError", "Não foi possível excluir a os.");
      throw new Error("Erro na requisição:" + connection.statusText);
    } else {
      mainTitle.innerHTML = "";
      osWrapper.style.backgroundColor = "transparent";
      osWrapper.style.boxShadow = "none";
      osWrapper.innerHTML = emptyPageOs;
      btn.forEach((btn) => {
        btn.style.display = "none";
      });
    }
  } catch (error) {
    console.error(error);
  }
};

btn.forEach((btn) => {
  if (btn.innerText.includes("EXCLUIR")) {
    btn.addEventListener("click", async () => {
      await deleteOs(filteredOs.id);
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
      <span class="os__code font-os-s-b">O.S: ${filteredOs.id}</span>
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

  //  7 é o numero maximo que cabe em cada os

  const handleMeasure = (element) => {
    let showMeasure = `##/##`;

    if (!filteredOs.hideMeasure) {
      showMeasure = `${element.height} / ${element.width}`;
    }
    return showMeasure;
  };

  const serviceValues = document.querySelector("[data-serviceValues]");
  filteredOs.service.forEach((element) => {
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
