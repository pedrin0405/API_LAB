// Configura a URL substituindo {VAR} pela variável fornecida
function configUrl(url, varItem) {
  return url.replace("{VAR}", encodeURIComponent(varItem));
}

// DATA
let data_JSON;
let data_XLS = [];

// Função principal para iniciar a requisição
async function startRequest() {
  const url = document.getElementById("search").value.trim();
  const method = document.getElementById("method").value;
  const varValue = document.getElementById("var_Value").value.trim();
  const headers = document.getElementById("headers").value;
  const body = document.getElementById("body").value;

  if (!url) {
    alert("Por favor, digite uma URL válida.");
    return;
  }

  document.getElementById("result").value = "Buscando dados...";

  try {
    if (!varValue) {
      // Requisição única
      const response = await request(url, method,  headers, body);
      handleResponse(response);
    } else {
      // Processamento múltiplo
      const listVar = varValue.split(",").map(item => item.trim());

      for (const variavel of listVar) {
        const newUrl = configUrl(url, variavel);
        const response = await request(newUrl, method);
        handleResponse(response);
      }
    }

    // Atualiza a exibição dos dados
    data_JSON = JSON.stringify(data_XLS, null, 2);
    document.getElementById("result").value = data_JSON;

  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao buscar os dados.");
  }
}

// Função para tratar a resposta da requisição
function handleResponse(response) {
  if (!response || typeof response !== "object") {
    console.error("Resposta inválida:", response);
    return;
  }

  if (response.error || response.erro) {
    console.warn("A API retornou um erro:", response);
    return;
  }

  if (!data_XLS.some(item => JSON.stringify(item) === JSON.stringify(response))) {
    data_XLS.push(response);
  } 
}

// Função para realizar requisições HTTP
async function request(url, method, headers, body) {
  try {
    const response = await fetch(url, { 
      method,
      headers,
      body
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    return { erro: true, message: error.message };
  }
}

// Alterna exibição das opções extras
function toggleOptions() {
  const extraOptions = document.getElementById("extra-options");
  extraOptions.style.display = extraOptions.style.display === "none" ? "block" : "none";
}

// Atualiza o link baseado na variável fornecida
function updateLink() {
  const url = document.getElementById("search").value.trim();
  const varValue = document.getElementById("var_Value").value.trim();

  if (!url) {
    alert("Por favor, digite uma URL válida.");
    return;
  }

  const newUrl = varValue ? configUrl(url, varValue.split(",")[0]) : url;
  document.getElementById("var_Search").value = newUrl;
}

// Configuração do modal de download
ModalDownload();

function ModalDownload() {
  const modal = document.getElementById("downloadModal");
  const btn = document.getElementById("btn-download");
  const closeBtn = document.querySelector(".close");
  const confirmBtn = document.getElementById("confirmDownload");
  const formatSelect = document.getElementById("formatSelect");

  // Abre e fecha o modal
  const openModal = () => modal.classList.add("show");
  const closeModal = () => modal.classList.remove("show");

  // Eventos do modal
  btn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  // Função de download em JSON
  function downloadJSON() {
    if (data_XLS.length === 0) {
      alert("Nenhum dado disponível para exportação.");
      return;
    }
    
    const blob = new Blob([JSON.stringify(data_XLS, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dados.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Função de download em XLSX (Excel)
  function downloadXLS() {
    if (data_XLS.length === 0) {
      alert("Nenhum dado disponível para exportação.");
      return;
    }

    if (typeof XLSX === "undefined") {
      alert("Biblioteca XLSX não carregada.");
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data_XLS);
    XLSX.utils.book_append_sheet(wb, ws, "Dados");

    XLSX.writeFile(wb, "dados.xlsx");
  }

  // Função de download em CSV
  function downloadCSV() {
    if (data_XLS.length === 0) {
      alert("Nenhum dado disponível para exportação.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = Object.keys(data_XLS[0]);
    csvContent += headers.join(",") + "\r\n";

    data_XLS.forEach(row => {
      const rowData = headers.map(header => row[header] ?? ""); 
      csvContent += rowData.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encodedUri;
    a.download = "dados.csv";
    a.click();
  }

  // Confirmação do formato de download
  confirmBtn.addEventListener("click", () => {
    const format = formatSelect.value;
    if (format === "json") downloadJSON();
    else if (format === "xls") downloadXLS();
    else if (format === "csv") downloadCSV();

    closeModal();
  });

  btn.addEventListener("click", function () {
    this.classList.toggle("downloaded");
    setTimeout(() => {
      // Executando depois de 3 segundos!;
      this.classList.toggle("downloaded");
    }, 3000);
    
  });
}

//Processar entrada input JSON
function previewJSON(name) {
  
  try {
    const input = document.getElementById(`${name}`).value;
    const jsonData = JSON.parse(input);
    document.getElementById(`output${name}`).textContent =`${name}: ` + JSON.stringify(jsonData, null, 2);
    document.getElementById(`output${name}`).classList.remove("error");
} catch (error) {
    // document.getElementById(`output${num}`).textContent = "Erro: JSON inválido!";
    document.getElementById(`output${name}`).classList.add("error");
}
}