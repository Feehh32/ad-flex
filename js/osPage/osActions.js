import { showMessage } from "../form/formClient.js";
import { btn } from "./os_page.js";

// Deletar a nota de serviço
export const deleteOs = async (urlOs, osId, mainTitle, osWrapper) => {
  const emptyPageOs = `<p class="font-r-xl color-3 msgOsDeleted">Sua nota de serviço foi excluida com sucesso!</p>
<a href=index.html class="font-r-m-b color-prim1 linkOsDeleted">voltar para a página principal</a>`;
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
