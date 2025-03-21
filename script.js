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
  let headers = document.getElementById("Header");
  let body = document.getElementById("Body");
  let data_API = document.getElementById("data_API").value;

  if (headers?.value && headers.value.trim() !== "") {
    headers = JSON.parse(headers.value);
  }
  
  if (body?.value && body.value.trim() !== "") {
    body = JSON.parse(body.value);
  }

  if (!url) {
    alert("Por favor, digite uma URL válida.");
    return;
  }

  document.getElementById("result").value = "Buscando dados...";

  try {
    if (!varValue) { // Requisição única
      const response = await request(url, method,  headers, body);

      if (!data_API || data_API.trim() === "") {
        handleResponse(response);
      } else {
        handleResponse(response[data_API]);
      } 

    } else {// Processamento múltiplo
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
    data_XLS = (unwrapValues(response));
  } 
}

// Função para realizar requisições HTTP
async function request(url, method, headers, body) {
  try {

    const options = { method }; // Sempre inclui o método
    if (headers) options.headers = headers;


    // Apenas adiciona o body se NÃO for um GET ou HEAD e se body existir
    if (body && method !== "GET" && method !== "HEAD") {
        options.body = body;
    }
    const response = await fetch(url, options);

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
  const botao = document.getElementById("options-btn");

  if (extraOptions.style.display === "none") {
    extraOptions.style.display = "block";
    botao.innerHTML = "Menos Opções"; 

  } else {
      extraOptions.style.display = "none";
      botao.innerHTML = "Mais Opções"; 
  }


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
  function downloadXLS(data) {
    if (data.length === 0) {
      alert("Nenhum dado disponível para exportação.");
      return;
    }

    if (typeof XLSX === "undefined") {
      alert("Biblioteca XLSX não carregada.");
      return;
    }

    // Transformar o array em um formato comum para o XLSX
    let data_XLS = formatDataForExport(data);

    // Criando a planilha
    const wb = XLSX.utils.book_new();

    console.log(">> Drive:"+ JSON.stringify(data_XLS))

    const ws = XLSX.utils.aoa_to_sheet([Object.keys(data_XLS)]); // Cabeçalho

    // Adicionando os dados sem repetir cabeçalho
    data_XLS.forEach(item => {
      const row = Object.values(item);
      XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 }); // Adiciona linha abaixo da última
    });

    // Adiciona a aba à planilha
    XLSX.utils.book_append_sheet(wb, ws, "Dados");

    // Gera o arquivo XLSX
    XLSX.writeFile(wb, "dados.xlsx");
  }

  // Função para transformar o dado para um formato simples
  function formatDataForExport(data) {
    if (Array.isArray(data)) {
      return data.map(item => flattenObject(item)); // Achatar cada item
    }
    return [];
  }

  // Função para "achatar" o objeto (caso ele tenha objetos aninhados)
  function flattenObject(obj, prefix = '') {
    let result = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}_${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Recursão para objetos aninhados
          Object.assign(result, flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
          // Se for array, transforma em string ou outro formato
          result[newKey] = JSON.stringify(value); // Aqui pode ser um formato diferente, caso queira
        } else {
          result[newKey] = value;
        }
      }
    }

    return result;
  }

  // Função de download em CSV
  function downloadCSV() {
    if (data_XLS.length === 0) {
      alert("Nenhum dado disponível para exportação.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = getJsonKeys(data_XLS[0]);
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
    else if (format === "xls") downloadXLS(data_XLS);
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

// Organiza as Arrays de retorno
function unwrapValues(arr) {
  // Verifica se arr é um array e se o primeiro item é um array
  if (Array.isArray(arr) && arr.length === 1) {
    return unwrapValues(arr[0]);  // Chama recursivamente para "desembrulhar"
  }
  return arr;  // Retorna o valor quando não há mais arrays dentro
}

function getJsonKeys(obj, prefix = "") {
  let keys = [];

  for (let key in obj) {
      let fullKey = prefix ? `${prefix}.${key}` : key; 
      keys.push(fullKey);

      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
          keys = keys.concat(getJsonKeys(obj[key], fullKey));
      }
  }

  return keys;
}