import { clients, os, urlClients } from "./main.js";

// Excluir clientes
const deleteClient = async (clientId) => {
  try {
    const response = await fetch(`${urlClients}/${clientId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      showMessage("activeError", "Não foi possível excluir o cliente.");
      throw new Error("Erro na requisição:" + connection.statusText);
    } else {
      showMessage("active", "Cliente excluido com sucesso.");
      const newClientsArray = clients.filter(
        (client) => client.id != parseInt(clientId)
      );
      displayClients(newClientsArray);
    }
  } catch (error) {
    console.error(error);
  }
};

const showMessage = (classMsg, textMessage) => {
  const msg = document.querySelector("[data-msg]");
  msg.classList.add(classMsg);
  msg.innerText = textMessage;

  setTimeout(() => {
    msg.classList.remove(classMsg);
  }, 3000);
};

// Filtro de clients
const filterClients = () => {
  const search = searchInput.value;
  const filteredClients = clients.filter((client) => {
    return client.nameClient
      ? client.nameClient.toLowerCase().includes(search.toLowerCase())
      : false;
  });
  return filteredClients;
};

const displayClients = (clients) => {
  clientsWrapper.innerHTML = "";

  if (isFilterActive) {
    const filteredClients = filterClients();
    if (filteredClients.length > 0) {
      filteredClients.forEach((client) => {
        const amountOs = () => {
          const osAmount = os.filter((os) => os.client === client.nameClient);
          return osAmount.length;
        };
        const osAmount = amountOs();

        clientsWrapper.innerHTML += `
        <div class="clients__card" data-card>
        <button type="button" class="btn-delete" data-client-id="${client.id}" title="Excluir cliente"></button>
        <span class="clients__decoration"></span>
        <h3 class="font-p-m-b color-1">${client.nameClient}</h3>
        <p class="font-r-l-b color-2">Ordens de serviço: <span class="font-r-l-b color-2">${osAmount}</span></p>
        <a class="color-prim5 font-r-l-b" href="./client.html?id=${client.id}">Ver tudo</a>
        </div>`;
      });
    } else {
      clientsWrapper.innerHTML = `<span class="font-p-m-b color-5 notFound-msg"> Nenhum cliente encontrado.</span>`;
    }
  } else {
    clients.forEach((client) => {
      const amountOs = () => {
        const osAmount = os.filter((os) => os.client === client.nameClient);
        return osAmount.length;
      };
      const osAmount = amountOs();

      clientsWrapper.innerHTML += `
      <div class="clients__card" data-card>
      <button type="button" class="btn-delete" data-client-id="${client.id}" title="Excluir cliente"></button>
      <span class="clients__decoration"></span>
      <h3 class="font-p-m-b color-1">${client.nameClient}</h3>
      <p class="font-r-l-b color-2">Ordens de serviço: <span class="font-r-l-b color-2">${osAmount}</span></p>
      <a class="color-prim5 font-r-l-b" href="./client.html?id=${client.id}">Ver tudo</a>
      </div>`;
    });
  }
};

const searchInput = document.querySelector("[data-search]");
const clientsWrapper = document.querySelector("[data-clients]");
let isFilterActive = false;

clientsWrapper.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("btn-delete")) {
    const clientId = target.getAttribute("data-client-id");

    const userConfirm = window.confirm(
      "Tem certeza que deseja apagar este cliente definitivamente."
    );

    if (userConfirm) {
      deleteClient(clientId);
    }
  }
});

search.addEventListener("input", () => {
  const searchValue = searchInput.value.trim();

  if (searchValue === "") {
    isFilterActive = false;
  } else {
    isFilterActive = true;
  }

  displayClients(clients);
});

displayClients(clients);
