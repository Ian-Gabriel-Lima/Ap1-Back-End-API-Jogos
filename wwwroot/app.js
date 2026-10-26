// =============================================================================
// Gerenciador de Jogos - Integração com API AP1
// Contratos baseados na collection Bruno validada (http://localhost:5050/api/jogos)
// =============================================================================

document.addEventListener("DOMContentLoaded", function () {
    // URL base da API (suporta execução sob porta 5050 ou como cliente externo)
    const API_URL = (window.location.port === "5050")
        ? "/api/jogos"
        : "http://localhost:5050/api/jogos";

    // Elementos do DOM
    const formJogo = document.getElementById("form-jogo");
    const inputId = document.getElementById("jogo-id");
    const inputTitulo = document.getElementById("titulo");
    const inputDesenvolvedora = document.getElementById("desenvolvedora");
    const tituloFormulario = document.getElementById("titulo-formulario");
    const descricaoFormulario = document.getElementById("descricao-formulario");
    const cardFormulario = document.getElementById("card-formulario");
    const btnSubmit = document.getElementById("btn-submit");
    const btnCancelar = document.getElementById("btn-cancelar");
    const btnLimpar = document.getElementById("btn-limpar");
    const btnRecarregar = document.getElementById("btn-recarregar");

    const corpoTabela = document.getElementById("corpo-tabela");
    const containerTabela = document.getElementById("container-tabela");
    const contadorJogos = document.getElementById("contador-jogos");
    const estadoVazio = document.getElementById("estado-vazio");
    const indicadorCarregamento = document.getElementById("indicador-carregamento");

    const mensagemErro = document.getElementById("mensagem-erro");
    const mensagemSucesso = document.getElementById("mensagem-sucesso");

    let timeoutSucesso = null;

    /**
     * Exibe mensagem de erro na interface usando textContent
     */
    function exibirErro(mensagem) {
        mensagemSucesso.style.display = "none";
        mensagemErro.textContent = mensagem;
        mensagemErro.style.display = "block";
    }

    /**
     * Exibe mensagem de sucesso com ocultamento automático usando textContent
     */
    function exibirSucesso(mensagem) {
        mensagemErro.style.display = "none";
        mensagemSucesso.textContent = mensagem;
        mensagemSucesso.style.display = "block";

        if (timeoutSucesso) {
            clearTimeout(timeoutSucesso);
        }

        timeoutSucesso = setTimeout(function () {
            mensagemSucesso.style.display = "none";
            mensagemSucesso.textContent = "";
        }, 4000);
    }

    /**
     * Oculta alertas de erro e sucesso
     */
    function limparAlertas() {
        mensagemErro.style.display = "none";
        mensagemErro.textContent = "";
        mensagemSucesso.style.display = "none";
        mensagemSucesso.textContent = "";
    }

    /**
     * Renderiza a lista de jogos recebida da API usando estritamente textContent
     */
    function renderizarTabela(jogos) {
        // Limpa o conteúdo atual da tabela de forma segura
        while (corpoTabela.firstChild) {
            corpoTabela.removeChild(corpoTabela.firstChild);
        }

        const total = Array.isArray(jogos) ? jogos.length : 0;
        contadorJogos.textContent = total === 1 ? "1 jogo" : `${total} jogos`;

        if (total === 0) {
            containerTabela.style.display = "none";
            estadoVazio.style.display = "block";
            return;
        }

        estadoVazio.style.display = "none";
        containerTabela.style.display = "block";

        jogos.forEach(function (jogo) {
            const linha = document.createElement("tr");

            // Coluna ID
            const celulaId = document.createElement("td");
            const spanId = document.createElement("span");
            spanId.className = "id-badge";
            spanId.textContent = `#${jogo.id !== undefined ? jogo.id : ""}`;
            celulaId.appendChild(spanId);
            linha.appendChild(celulaId);

            // Coluna Título
            const celulaTitulo = document.createElement("td");
            celulaTitulo.textContent = jogo.titulo ?? "";
            linha.appendChild(celulaTitulo);

            // Coluna Desenvolvedora
            const celulaDev = document.createElement("td");
            celulaDev.textContent = jogo.desenvolvedora ?? "";
            linha.appendChild(celulaDev);

            // Coluna Ações
            const celulaAcoes = document.createElement("td");
            celulaAcoes.style.textAlign = "center";

            const containerAcoes = document.createElement("div");
            containerAcoes.className = "acoes-linha";

            // Botão Editar
            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.className = "btn btn-editar btn-sm";
            btnEditar.textContent = "Editar";
            btnEditar.addEventListener("click", function () {
                iniciarEdicao(jogo);
            });

            // Botão Excluir
            const btnExcluir = document.createElement("button");
            btnExcluir.type = "button";
            btnExcluir.className = "btn btn-perigo btn-sm";
            btnExcluir.textContent = "Excluir";
            btnExcluir.addEventListener("click", function () {
                excluirJogo(jogo.id, jogo.titulo);
            });

            containerAcoes.appendChild(btnEditar);
            containerAcoes.appendChild(btnExcluir);
            celulaAcoes.appendChild(containerAcoes);
            linha.appendChild(celulaAcoes);

            corpoTabela.appendChild(linha);
        });
    }

    /**
     * Operação GET: Listar todos os jogos da API
     */
    async function listarJogos() {
        indicadorCarregamento.style.display = "flex";
        containerTabela.style.display = "none";
        estadoVazio.style.display = "none";

        try {
            const resposta = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!resposta.ok) {
                throw new Error(`Falha HTTP ${resposta.status}: ${resposta.statusText || "Erro ao consultar a API"}`);
            }

            const dados = await resposta.json();
            renderizarTabela(dados);
        } catch (erro) {
            contadorJogos.textContent = "0 jogos";
            containerTabela.style.display = "none";
            estadoVazio.style.display = "none";
            exibirErro(`Erro ao carregar lista de jogos: ${erro.message}`);
        } finally {
            indicadorCarregamento.style.display = "none";
        }
    }

    /**
     * Prepara o formulário para edição de um jogo existente
     */
    function iniciarEdicao(jogo) {
        inputId.value = jogo.id;
        inputTitulo.value = jogo.titulo ?? "";
        inputDesenvolvedora.value = jogo.desenvolvedora ?? "";

        tituloFormulario.textContent = `Editar Jogo #${jogo.id}`;
        descricaoFormulario.textContent = "Altere os campos abaixo e clique em Salvar para atualizar na API.";
        btnSubmit.textContent = "Salvar Alterações";
        btnCancelar.style.display = "inline-flex";
        cardFormulario.classList.add("modo-edicao-ativo");

        cardFormulario.scrollIntoView({ behavior: "smooth", block: "start" });
        inputTitulo.focus();
    }

    /**
     * Cancela o modo de edição e restaura o formulário para cadastro
     */
    function cancelarEdicao() {
        inputId.value = "";
        formJogo.reset();

        tituloFormulario.textContent = "Cadastrar Novo Jogo";
        descricaoFormulario.textContent = "Preencha os campos para enviar uma requisição à API.";
        btnSubmit.textContent = "Cadastrar Jogo";
        btnCancelar.style.display = "none";
        cardFormulario.classList.remove("modo-edicao-ativo");
    }

    /**
     * Operações POST e PUT: Cadastrar novo jogo ou atualizar existente
     */
    async function submeterFormulario(evento) {
        evento.preventDefault();

        const id = inputId.value.trim();
        const titulo = inputTitulo.value.trim();
        const desenvolvedora = inputDesenvolvedora.value.trim();

        if (!titulo || !desenvolvedora) {
            exibirErro("Por favor, preencha os campos de Título e Desenvolvedora.");
            return;
        }

        // Payload estruturado exatamente como na collection Bruno
        const corpoRequisicao = {
            Titulo: titulo,
            Desenvolvedora: desenvolvedora
        };

        btnSubmit.disabled = true;

        try {
            if (id) {
                // Operação PUT: /api/jogos/{id}
                const urlPut = `${API_URL}/${encodeURIComponent(id)}`;
                const resposta = await fetch(urlPut, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(corpoRequisicao)
                });

                if (resposta.ok) {
                    exibirSucesso(`Jogo #${id} atualizado com sucesso na API!`);
                    cancelarEdicao();
                    await listarJogos();
                } else if (resposta.status === 404) {
                    exibirErro(`Jogo #${id} não foi encontrado na API (Status HTTP 404 Not Found).`);
                } else {
                    exibirErro(`Erro ao atualizar jogo (Status HTTP ${resposta.status}: ${resposta.statusText || "Erro"}).`);
                }
            } else {
                // Operação POST: /api/jogos
                const resposta = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(corpoRequisicao)
                });

                if (resposta.status === 201 || resposta.ok) {
                    exibirSucesso("Jogo cadastrado com sucesso na API!");
                    cancelarEdicao();
                    await listarJogos();
                } else {
                    exibirErro(`Erro ao cadastrar jogo (Status HTTP ${resposta.status}: ${resposta.statusText || "Erro"}).`);
                }
            }
        } catch (erro) {
            exibirErro(`Erro de comunicação com a API: ${erro.message}`);
        } finally {
            btnSubmit.disabled = false;
        }
    }

    /**
     * Operação DELETE: Remover jogo por ID
     */
    async function excluirJogo(id, titulo) {
        const confirmacao = window.confirm(`Deseja realmente excluir o jogo #${id} ("${titulo}") da API?`);
        if (!confirmacao) {
            return;
        }

        try {
            const urlDelete = `${API_URL}/${encodeURIComponent(id)}`;
            const resposta = await fetch(urlDelete, {
                method: "DELETE"
            });

            if (resposta.status === 204 || resposta.ok) {
                exibirSucesso(`Jogo #${id} removido com sucesso da API!`);

                // Se o jogo excluído estava sendo editado, reseta o formulário
                if (inputId.value === String(id)) {
                    cancelarEdicao();
                }

                await listarJogos();
            } else if (resposta.status === 404) {
                exibirErro(`Jogo #${id} não foi encontrado na API (Status HTTP 404 Not Found).`);
            } else {
                exibirErro(`Erro ao excluir jogo (Status HTTP ${resposta.status}: ${resposta.statusText || "Erro"}).`);
            }
        } catch (erro) {
            exibirErro(`Erro de comunicação ao excluir jogo: ${erro.message}`);
        }
    }

    // Event Listeners
    formJogo.addEventListener("submit", submeterFormulario);

    btnCancelar.addEventListener("click", function () {
        cancelarEdicao();
        limparAlertas();
    });

    btnLimpar.addEventListener("click", function () {
        cancelarEdicao();
        limparAlertas();
    });

    btnRecarregar.addEventListener("click", function () {
        limparAlertas();
        listarJogos();
    });

    // Carga inicial dos jogos ao abrir a página
    listarJogos();
});
