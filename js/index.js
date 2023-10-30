import { clients, os } from "./main.js";

const clientsWrapper = document.querySelector("[data-wrapper]");

const filterClients = () => {
  clients.sort((a, b) => {
    return b.os - a.os;
  });

  const newClientsArray = clients.slice(0, 3);
  return newClientsArray;
};

const filteredClients = filterClients();

filteredClients.forEach((client) => {
  const amountOs = () => {
    const osAmount = os.filter((os) => os.client === client.name);
    return osAmount.length;
  };
  const osAmount = amountOs();

  clientsWrapper.innerHTML += `
    <div class="clients__card">
        <span class="clients__decoration"></span>
        <h3 class="font-p-m-b color-1">${client.name}</h3>
        <p class="font-r-l-b color-2">Ordens de serviço: <span class="font-r-l-b color-2">${osAmount}</span></p>
        <a class="color-prim5 font-r-l-b" href="./client.html?id=${client.id}">Ver tudo</a>
    </div>
    `;
});
