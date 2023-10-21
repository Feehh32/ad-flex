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

export const clients = [...responseClients];

// Fetch das notas de serviço
export const urlOs = "http://localhost:3000/os";

const responseOs = await fetch(urlOs)
  .then((resp) => resp.json())
  .then((data) => {
    return data;
  })
  .catch((error) => {
    console.error(error);
    responseClients = [];
  });

export const os = [...responseOs];
