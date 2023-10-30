import { showMessage } from "../form/formClient.js";

// Deletar a nota de serviço
export const deleteOs = async (urlOs, osId) => {
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
