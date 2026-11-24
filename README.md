# API de Gerenciamento de Jogos

API desenvolvida em C# utilizando Minimal APIs no .NET (.NET 10) para realizar operações fundamentais de CRUD (Create, Read, Update, Delete) em um catálogo de jogos, com persistência relacional em SQLite via Entity Framework Core.

---

## 🏛️ Organização Arquitetural e Novidades da AS (Avaliação Semestral)

Nesta etapa (AS), o projeto foi reestruturado separando as responsabilidades em arquivos e pastas específicas, eliminando o acúmulo de tipos no `Program.cs`:

* **`Models/`**: Contém a entidade de domínio [`JogoEntity.cs`](Models/JogoEntity.cs), mapeada na tabela `Jogos` do SQLite.
* **`Dtos/`**: Contém o tipo de entrada [`JogoEntradaDto.cs`](Dtos/JogoEntradaDto.cs) implementado como `record` para transporte imutável de dados.
* **`Data/`**: Contém o contexto do banco de dados [`ApiDbContext.cs`](Data/ApiDbContext.cs), gerenciando o `DbSet<JogoEntity>`.
* **Tratamento Global de Exceções**: Implementado no pipeline via `app.UseExceptionHandler`, retornando erro padronizado em JSON com status `500 Internal Server Error`, testável pela rota `/api/teste-erro`.
* **Single Responsibility**: `Program.cs` atua estritamente na inicialização do app, injeção de dependências, middlewares e mapeamento das rotas.

---

## 📋 Pré-requisitos

* [.NET 10 SDK](https://dotnet.microsoft.com/download) instalado.
* [VS Code](https://code.visualstudio.com/) ou IDE de sua preferência.
* [Bruno](https://www.usebruno.com/) para execução dos testes automatizados da API.

---

## 🚀 Como Executar o Projeto e Preparar o Banco

1. Abra o terminal na raiz do repositório (`AP1-BackEnd`):
   ```bash
   cd AP1-BackEnd
   ```

2. Compile o projeto para restaurar dependências e verificar integridade:
   ```bash
   dotnet build
   ```

3. Inicie a aplicação:
   ```bash
   dotnet run
   ```
   > **Nota sobre o banco de dados:** A aplicação utiliza SQLite. Na primeira inicialização, o método `EnsureCreated()` cria automaticamente as tabelas e realiza a carga inicial (*seed*) com os 2 jogos pré-definidos (`#1 God of War 3` e `#2 Red Dead Redemption 2`). Também é possível aplicar as migrations diretamente via CLI:
   > ```bash
   > dotnet ef database update
   > ```

4. **Acessando a Interface Gráfica:**
   Com a API rodando, abra o navegador e acesse diretamente:
   👉 **`http://localhost:5050`**
   *(A interface estática contida em `wwwroot` é servida pela mesma origem da API via middlewares `UseDefaultFiles` e `UseStaticFiles`).*

---

## 📌 Endpoints da API

A API está configurada na porta `5050` com as seguintes rotas:

| Método | Rota | Descrição | Status de Sucesso | Status de Erro |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/` | Health check da API / Redirecionamento web | `200 OK` / `302` | - |
| `GET` | `/api/jogos` | Retorna a lista completa de jogos cadastrados | `200 OK` | `500` |
| `GET` | `/api/jogos/{id}` | Busca um jogo específico pelo seu ID | `200 OK` | `404 Not Found` |
| `POST` | `/api/jogos` | Cadastra um novo jogo no SQLite | `201 Created` | `400` / `500` |
| `PUT` | `/api/jogos/{id}` | Atualiza os dados de um jogo existente | `200 OK` | `404 Not Found` |
| `DELETE` | `/api/jogos/{id}` | Remove um jogo do banco pelo ID | `204 NoContent` | `404 Not Found` |
| `GET` | `/api/teste-erro` | Dispara intencionalmente uma exceção para validar o `UseExceptionHandler` | - | `500 InternalServerError` |

---

## 📝 Exemplos de Payload (JSON)

**Cadastrar Jogo (`POST /api/jogos`)**
```json
{
  "titulo": "GTA 6",
  "desenvolvedora": "Rockstar Games"
}
```

**Atualizar Jogo (`PUT /api/jogos/{id}`)**
```json
{
  "titulo": "Resident Evil 4",
  "desenvolvedora": "Capcom"
}
```

---

## 🧪 Collection de Testes (Bruno)

As requisições prontas e sequenciadas para testes da API estão na pasta [`/bruno/AP1-BackEnd`](bruno/AP1-BackEnd):

1. **`Listar Jogos`** (`GET /api/jogos`) ➔ Retorna lista com os jogos `#1` e `#2` do seed inicial.
2. **`Obter Jogo por ID`** (`GET /api/jogos/1`) ➔ Retorna o jogo com ID 1.
3. **`Cadastrar Jogo`** (`POST /api/jogos`) ➔ Cria novo jogo, recebendo o ID 3.
4. **`Atualizar jogo`** (`PUT /api/jogos/3`) ➔ Atualiza as informações do jogo ID 3.
5. **`Remover Jogo`** (`DELETE /api/jogos/3`) ➔ Exclui o jogo ID 3 (`204 No Content`).
6. **`Confirmar Removido`** (`GET /api/jogos/3`) ➔ Confirma a exclusão (`404 Not Found`).
7. **`Teste de Erro 500`** (`GET /api/teste-erro`) ➔ Valida o tratamento global de exceções.
8. **`API no ar!`** (`GET /`) ➔ Verifica status da raiz.

---

## 🎥 Vídeos de Demonstração

### Vídeo de demonstração — AS
* 
