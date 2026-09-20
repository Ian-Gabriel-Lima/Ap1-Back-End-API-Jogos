# API de Gerenciamento de Jogos

API desenvolvida em C# utilizando Minimal APIs no .NET (vers: 10.0.302) para realizar operações fundamentais de CRUD (Create, Read, Update, Delete) em um catálogo de jogos.

--------------------------------------------------------------------------------

## Build compila?
PS C:\Users\ianga\OneDrive\Desktop\AP1-BackEnd> dotnet build
Restauração concluída (0,6s)
  AP1-BackEnd net10.0 êxito (0,5s) → bin\Debug\net10.0\AP1-BackEnd.dll

 Construir êxito em 2,3s
--------------------------------------------------------------------------------



## 📋 Pré-requisitos

* [.NET 10 SDK](https://dotnet.microsoft.com/download) instalado no seu sistema.
* dotnet run --urls http://localhost:5050 ------ comando para rodar a aplicação na porta 5050

--------------------------------------------------------------------------------

## 🚀 Como Executar o Projeto

1. Abra o terminal na raiz do repositório (`AP1-BackEnd`):
   ```bash
   cd AP1-BackEnd

--------------------------------------------------------------------------------

## 📌 Endpoints da API

| Método |     Rota      |     Descrição    |
| :---   | :---          |  :---            |
| `GET` | `/api/jogos` | Retorna a lista completa de jogos. |
| `GET` | `/api/jogos/{id}` | Busca um jogo específico pelo ID. |
| `POST` | `/api/jogos` | Cadastra um novo jogo. |
| `PUT` | `/api/jogos/{id}` | Atualiza as informações de um jogo pelo ID. |
| `DELETE` | `/api/jogos/{id}` | Remove um jogo pelo ID. |

--------------------------------------------------------------------------------


## Exemplos de Payload (JSON):

    Criar Jogo (POST /api/jogos):

    {
  "titulo": "The Last of Us"
}


    Atualizar Jogo (PUT /api/jogos/{id}):

    {
  "titulo": "God of War Ragnarok"
}

---------------------------------------------------------------------------------

## Aviso: Esta API armazena as informações apenas em memória (List<JogoDto>). Qualquer alteração (criação, edição ou remoção) será perdida quando a aplicação for reiniciada.

---------------------------------------------------------------------------------

## Collection de Testes
As requisições prontas para testes da API foram criadas no Bruno e estão salvas na pasta:
/bruno (na raiz do repositório como solicitado).

----------------------------------------------------------------------------------

## Link do vídeo Demonstração:
- 
