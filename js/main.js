// Animação
if (window.SimpleAnime) {
  new SimpleAnime();
}

// Fetch de clientes
export const urlClients = "http://localhost:3000/clients";

const responseClients = await fetch(urlClients)
  .then((resp) => resp.json())
  .then((data) => {
    return data;
  })
  .catch((error) => console.error(error));
export const clients = responseClients.clients;

// Fetch das notas de serviço
export const urlOs = "http://localhost:3000/os";

const responseOs = await fetch(urlOs)
  .then((resp) => resp.json())
  .then((data) => {
    return data;
  })
  .catch((error) => {
    console.error(error);
    responseClients.clients = [];
  });
export const os = responseOs.os;

// Fetch dos serviços da nota

export const urlServices = "http://localhost:3000/service_details";

export const handleServiceDetails = async (noteId) => {
  const responseService = await fetch(`${urlServices}/${noteId}`)
    .then((resp) => resp.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Erro ao buscar no servidor", error);
    });
  const service = responseService.data;
  return service;
};
