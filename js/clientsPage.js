import { clients } from "./main.js";

const clientsWrapper = document.querySelector("[data-clients]");

clients.forEach((client) => {
  clientsWrapper.innerHTML += `
    <div class="clients__card" data-card>
    <span class="clients__decoration"></span>
    <h3 class="font-p-m-b color-1">${client.nameClient}</h3>
    <p class="font-r-l-b color-2">Ordens de serviço: <span class="font-r-l-b color-2">0</span></p>
    <a class="color-prim5 font-r-l-b" href="./client.html?id=${client.id}">Ver tudo</a>
    </div>`;
});
