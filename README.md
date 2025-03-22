# ⚙️ **API LAB** - Teste e Exporte Dados de APIs de Forma Simples

## Descrição

**API LAB** é uma ferramenta web interativa que permite a desenvolvedores e testadores fazer requisições HTTP para APIs, processar os dados de resposta e exportá-los em formatos úteis como JSON, XLSX (Excel) e CSV. Este projeto oferece uma interface limpa e simples, com suporte para múltiplas variáveis de URL e personalização de cabeçalhos e corpo de requisição.

## Funcionalidades

### 🚀 **Requisições HTTP Personalizáveis**
O **API LAB** oferece suporte para os métodos HTTP mais comuns:
- **GET**: Requisições simples de leitura.
- **POST**: Envio de dados para a API.
- **HEAD**: Recuperação apenas dos cabeçalhos de resposta.

Você pode configurar a URL, escolher o método e enviar cabeçalhos e corpo de requisição personalizados.

### 🔄 **Requisições com Variáveis Dinâmicas**
Utilizando a sintaxe `{VAR}` na URL, você pode realizar múltiplas requisições com diferentes valores para a variável. Por exemplo:
- URL: `https://api.exemplo.com/items/{VAR}`
- Valores: `1, 2, 3`

Isso gerará automaticamente as requisições para:
- `https://api.exemplo.com/items/1`
- `https://api.exemplo.com/items/2`
- `https://api.exemplo.com/items/3`

### 🔧 **Cabeçalhos e Corpo Personalizados**
Você pode facilmente configurar:
- **Cabeçalhos**: Insira cabeçalhos em formato JSON para configurar autenticações, tipos de conteúdo, etc.
- **Corpo de Requisição**: Envie dados no corpo da requisição em formato JSON para métodos como `POST` ou `PUT`.

### 📊 **Exibição de Dados**
Os dados retornados pela API são apresentados em um formato legível na interface, permitindo que você visualize e manipule os resultados de maneira clara.

### 🧹 **Limpeza de Dados**
Se você deseja começar novamente, há um botão para limpar todos os dados e resultados exibidos, mantendo a interface limpa.

### 💾 **Exportação de Dados**
Exportar os resultados das requisições é fácil:
- **JSON**: Para obter os dados em formato JSON.
- **XLSX (Excel)**: Para gerar uma planilha no formato Excel.
- **CSV**: Para obter os dados em formato CSV.

Os formatos podem ser selecionados através de um modal simples, garantindo flexibilidade para o tipo de dados desejado.

### 🧰 **Visualização e Validação de Dados**
Ao inserir JSON nos campos de cabeçalhos e corpo, o sistema valida automaticamente a entrada, exibindo uma mensagem de erro caso o JSON esteja malformado. Isso ajuda a evitar erros comuns na configuração de requisições.

### 📐 **Interface Responsiva**
O layout é projetado para ser intuitivo e responsivo, adaptando-se a diferentes dispositivos, garantindo que o uso seja fácil tanto em desktops quanto em dispositivos móveis.

## Instalação e Execução

Para rodar o projeto localmente, basta seguir as etapas abaixo:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/api-lab.git

2. **Abra o arquivo index.html em seu navegador:**:
- Não é necessário nenhum servidor, o projeto pode ser executado diretamente no navegador.

## Como Contribuir

Se você deseja contribuir com melhorias ou correções neste projeto, siga as etapas abaixo:

1. Faça um fork deste repositório.
2. Crie uma branch para sua feature ou correção:
   ```bash
   git checkout -b minha-nova-feature
