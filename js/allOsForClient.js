import { os, serviceArray } from "./main.js";

// Pegando o nome do cliente pela url
const getClientFromName = () => {
  const paramsUrl = new URLSearchParams(window.location.search);
  return paramsUrl.get("name");
};

const clientName = getClientFromName();
const filteredOs = os.filter((os) => os.client === clientName);
const osWrapper = document.querySelector("[data-AllOsClient]");

// Alterando a cor do cabeçalho de acordo com a url
let urlPage = window.location.href;
urlPage = urlPage.split("/")[3];
if (urlPage === `all_os_for_client.html?name=${clientName}`) {
  document.querySelector("[data-header]").style.backgroundColor =
    "var(--color-10)";
}

// Renderizando as os na tela
filteredOs.forEach((os) => {
  const title = document.querySelector("[data-allOsTitle]");
  title.innerHTML = `${os.client}<span class="color-prim1">.</span>`;
  const service = serviceArray.find((service) => service.note_id === os.id);
  osWrapper.innerHTML += `
        <li>
          <p>${os.code}</p>
          <p>${service.serviceName}</p>
          <p>${os.date}</p>
          <a href="./os_page.html?id=${os.id}&client=${os.client}" class="font-os-s">Ver nota</a>
        </li>
   
  `;
});
