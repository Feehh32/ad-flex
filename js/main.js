// Animação
if (window.SimpleAnime) {
  new SimpleAnime();
}

// Fetch de clientes
export const url = "http://localhost:3000/clients";

const response = await fetch(url)
  .then((resp) => resp.json())
  .then((data) => {
    return data;
  })
  .catch((error) => console.error(error));

export const clients = [...response];
