# API de Gerenciamento de Jogos

API desenvolvida em C# utilizando Minimal APIs no .NET (vers: 10.0.302) para realizar operações fundamentais de CRUD (Create, Read, Update, Delete) em um catálogo de jogos.


# ATUALIZAÇÃO DE AP2: 
- Agora o crud é persistente,com o Entity Framework core que permite manipulação de  bancos de dados relacionais diretamente por meio de objetos em código, eliminando a necessidade de escrever comandos SQL complexos e manuais.
- Interface aos endpoints  conectados com Antigravity.
  
--------------------------------------------------------------------------------

## Build compila?
PS C:\Users\ianga\OneDrive\Desktop\AP1-BackEnd> dotnet build
Restauração concluída (0,6s)
  AP1-BackEnd net10.0 êxito (0,5s) → bin\Debug\net10.0\AP1-BackEnd.dll

 Construir êxito em 2,3s
--------------------------------------------------------------------------------


## 📋 Pré-requisitos

* VScode para instalar as ferramentas necessárias!:
* [.NET 10 SDK](https://dotnet.microsoft.com/download) instalado no seu sistema.
* SQLite Viewer caso deseje vizualizar a Tabela do banco de dados da aplicação.

--------------------------------------------------------------------------------

## 🚀 Como Executar o Projeto

1. Abra o terminal na raiz do repositório (`AP1-BackEnd`):
   ```bash
   cd AP1-BackEnd
   No terminal do Vscode use o seguinte comando: (dotnet run)  para rodar a aplicação.
   Em seguida va até a pasta wwwroot selecione com o botão direito do mouse index.html e clique em (ir ao local do arquivo) de dois cliques no arquivo index.html que a página no navegador deve carregar.
--------------------------------------------------------------------------------

## 🚀 Endpoints da API

A API está configurada na porta `5050` e disponibiliza as seguintes rotas para gerenciamento dos jogos:

### ℹ️ Status da API
* **`GET /`**
  * **Descrição:** Rota raiz para verificar a saúde da aplicação.
  * **Resposta (200 OK):** Indica que a API está online e operando normalmente.

### 🎮 Gerenciamento de Jogos
* **`GET /api/jogos`**
  * **Descrição:** Retorna a listagem completa de todos os jogos cadastrados no banco de dados.
  * **Resposta (200 OK):** Array contendo os objetos dos jogos.

* **`GET /api/jogos/{id}`**
  * **Descrição:** Busca os detalhes de um jogo específico através do seu ID numérico.
  * **Respostas:**
    * `200 OK`: Retorna os dados do jogo encontrado.
    * `404 Not Found`: Caso o ID informado não exista.

* **`POST /api/jogos`**
  * **Descrição:** Cadastra um novo jogo na base de dados.
  * **Corpo da Requisição (JSON - `JogoEntradaDto`):**
    ```json
    {
      "titulo": "Nome do Jogo",
      "desenvolvedora": "Nome da Empresa"
    }
    ```
  * **Resposta (201 Created):** Retorna o objeto criado (já preenchido com o ID gerado automaticamente) e o link de localização no cabeçalho.

* **`PUT /api/jogos/{id}`**
  * **Descrição:** Atualiza as informações de um jogo existente com base no ID enviado.
  * **Corpo da Requisição (JSON - `JogoEntradaDto`):**
    ```json
    {
      "titulo": "Novo Nome do Jogo",
      "desenvolvedora": "Nova Empresa"
    }
    ```
  * **Respostas:**
    * `200 OK`: Retorna o objeto atualizado.
    * `404 Not Found`: Caso o ID informado não seja encontrado.

* **`DELETE /api/jogos/{id}`**
  * **Descrição:** Remove permanentemente um jogo do banco de dados pelo seu ID.
  * **Respostas:**
    * `204 No Content`: Exclusão realizada com sucesso (sem corpo de resposta).
    * `404 Not Found`: Caso o ID informado não exista.

## 📝 Exemplos de Payload (JSON)

No bruno selecione body -> json e rode a requisição

**Criar Jogo (`POST /api/jogos`)**
```json
{
  "titulo": "The Last of Us Part I",
  "desenvolvedora": "Naughty Dog"
}
 ** Atualizar jogo (`POST /api/jogos`)**
 {
  "titulo": "God of War Ragnarök",
  "desenvolvedora": "Santa Monica Studio"
}
---------------------------------------------------------------------------------

## Collection de Testes
As requisições prontas para testes da API foram criadas no Bruno e estão salvas na pasta:
/bruno (na raiz do repositório como solicitado).

----------------------------------------------------------------------------------

## Link do vídeo Demonstração:
-- https://drive.google.com/file/d/1xcqg3ofD2FKdjEjq2wLNM86s3skxGtPn/view?usp=sharing
