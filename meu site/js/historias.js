/* ==========================================================================
   Douradinho — Carregamento e renderização das histórias
   ==========================================================================
   Todo o carregamento é centralizado aqui. Para migrar de um JSON local
   para uma API externa, basta alterar a constante API_URL (o caminho do
   JSON pode ser sobrescrito via data-historias-url no <body>) — o restante
   do código permanece o mesmo.
   ========================================================================== */

(function () {
  "use strict";

  /* Caminho dos dados: lê do atributo data-historias-url no <body>, com
     fallback para o caminho padrão (raiz do site). */
  const API_URL = document.body.dataset.historiasUrl || "dados/historias.json";

  document.addEventListener("DOMContentLoaded", function () {
    carregarHistorias();
    initBusca();
  });

  /* Busca os dados e decide o comportamento conforme a página */
  async function carregarHistorias() {
    try {
      const historias = await fetchHistorias();

      // Página inicial: exibe apenas as 3 mais recentes
      if (document.body.dataset.historiasUrl === "dados/historias.json" && isPaginaInicial()) {
        renderizarRecentes(historias.slice(0, 3));
        return;
      }

      // Página /historias: exibe todas
      renderizarTodas(historias);
    } catch (error) {
      console.error("Falha ao carregar histórias:", error);
      mostrarErro();
    }
  }

  /* Função reutilizável de fetch com tratamento de erro */
  async function fetchHistorias() {
    const resposta = await fetch(API_URL, { headers: { Accept: "application/json" } });

    if (!resposta.ok) {
      throw new Error("Resposta da rede não foi ok: " + resposta.status);
    }

    const dados = await resposta.json();
    const historias = dados.historias || [];

    // Ordena da mais recente para a mais antiga
    return historias.sort(function (a, b) {
      return new Date(b.data) - new Date(a.data);
    });
  }

  function isPaginaInicial() {
    // A home não possui formulário de busca nem modal
    return !document.querySelector("[data-modal]");
  }

  /* Escapa HTML para evitar injeção de conteúdo */
  function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto == null ? "" : String(texto);
    return div.innerHTML;
  }

  function formatarData(iso) {
    const data = new Date(iso + "T00:00:00");
    if (isNaN(data.getTime())) return iso;
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  }

  function removerSkeletons() {
    const container = document.querySelector("[data-stories-list]");
    if (container) {
      container.querySelectorAll(".skeleton-card").forEach(function (sk) {
        sk.remove();
      });
    }
    return container;
  }

  /* Card de uma história (usado na home e na listagem completa) */
  function montarCard(historia, comBotaoLer) {
    const card = document.createElement("article");
    card.className = "card story-card";
    card.setAttribute("data-historia-id", historia.id);

    let meta = "";
    if (historia.data) {
      meta = '<span class="story-date">' + escaparHTML(formatarData(historia.data)) + "</span>";
    }

    let autor = "";
    if (historia.autor) {
      autor = '<p class="story-author">' + escaparHTML(historia.autor) + "</p>";
    }

    let botao = "";
    if (comBotaoLer) {
      botao =
        '<button type="button" class="btn-read" data-ler="' + escaparHTML(historia.id) + '">Ler história</button>';
    }

    card.innerHTML =
      '<div class="story-meta">' + meta + "</div>" +
      "<h3>" + escaparHTML(historia.titulo) + "</h3>" +
      autor +
      '<p class="story-resumo">' + escaparHTML(historia.resumo) + "</p>" +
      botao;

    return card;
  }

  /* Renderiza as 3 histórias recentes na home */
  function renderizarRecentes(historias) {
    const container = removerSkeletons();
    if (!container) return;

    if (!historias.length) {
      container.innerHTML =
        '<p style="grid-column:1/-1; color:rgba(10,31,68,.7)">Ainda não há histórias por aqui. Volte em breve!</p>';
      return;
    }

    historias.forEach(function (historia) {
      container.appendChild(montarCard(historia, false));
    });
  }

  /* Renderiza todas as histórias na página /historias */
  function renderizarTodas(historias) {
    window.__todasHistorias = historias;

    const container = removerSkeletons();
    if (!container) return;

    if (!historias.length) {
      mostrarVazio();
      return;
    }

    historias.forEach(function (historia) {
      container.appendChild(montarCard(historia, true));
    });

    atualizarContagem(historias.length);
    initModal();
  }

  /* ========================================================================
     Busca em tempo real (filtro client-side)
     ======================================================================== */
  function initBusca() {
    const campo = document.getElementById("campo-busca");
    if (!campo) return;

    campo.addEventListener("input", function () {
      const termo = campo.value.trim().toLowerCase();
      const todas = window.__todasHistorias || [];

      const filtradas = todas.filter(function (historia) {
        const alvo = [historia.titulo, historia.autor, historia.resumo, historia.conteudo]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return alvo.includes(termo);
      });

      renderizarFiltradas(filtradas);
    });
  }

  function renderizarFiltradas(historias) {
    const container = document.querySelector("[data-stories-list]");
    const vazio = document.querySelector("[data-empty]");
    if (!container) return;

    container.innerHTML = "";

    if (!historias.length) {
      vazio.hidden = false;
      atualizarContagem(0);
      return;
    }

    vazio.hidden = true;
    historias.forEach(function (historia) {
      container.appendChild(montarCard(historia, true));
    });
    atualizarContagem(historias.length);
  }

  function atualizarContagem(n) {
    const contador = document.querySelector("[data-results-count]");
    if (contador) {
      contador.textContent = n === 1 ? "1 história" : n + " histórias";
    }
  }

  function mostrarVazio() {
    const vazio = document.querySelector("[data-empty]");
    if (vazio) vazio.hidden = false;
    atualizarContagem(0);
  }

  function mostrarErro() {
    const container = document.querySelector("[data-stories-list]");
    if (container) {
      container.querySelectorAll(".skeleton-card").forEach(function (sk) { sk.remove(); });
    }
    const erro = document.querySelector("[data-error]");
    if (erro) erro.hidden = false;
  }

  /* ========================================================================
     Modal acessível para leitura da história completa
     ======================================================================== */
  function initModal() {
    const modal = document.querySelector("[data-modal]");
    if (!modal) return;

    const fechadores = modal.querySelectorAll("[data-modal-close]");
    const titulo = document.getElementById("modal-titulo");
    const meta = document.getElementById("modal-meta");
    const autor = document.getElementById("modal-autor");
    const conteudo = document.getElementById("modal-conteudo");

    let ultimoFoco = null;

    function abrir(id) {
      const historia = (window.__todasHistorias || []).find(function (h) {
        return h.id === id;
      });
      if (!historia) return;

      ultimoFoco = document.activeElement;
      meta.textContent = historia.data ? formatarData(historia.data) : "";
      titulo.textContent = historia.titulo;
      autor.textContent = historia.autor ? "Contada por " + historia.autor : "";
      conteudo.textContent = historia.conteudo || "";

      modal.hidden = false;
      document.body.classList.add("modal-open");
      const botaoFechar = modal.querySelector(".modal-close");
      botaoFechar.focus();
    }

    function fechar() {
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      if (ultimoFoco && typeof ultimoFoco.focus === "function") {
        ultimoFoco.focus();
      }
    }

    // Delegação de eventos para os botões "Ler história"
    document.querySelector("[data-stories-list]").addEventListener("click", function (event) {
      const botao = event.target.closest("[data-ler]");
      if (botao) abrir(botao.getAttribute("data-ler"));
    });

    fechadores.forEach(function (el) {
      el.addEventListener("click", fechar);
    });

    // Fecha com a tecla Esc
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) {
        fechar();
      }
    });
  }
})();
