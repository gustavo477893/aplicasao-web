/* ==========================================================================
   Douradinho — Carregamento e renderização das festas
   ==========================================================================
   O carregamento é centralizado aqui. Para migrar de um JSON local para uma
   API externa, basta alterar a constante API_URL (caminho sobrescrito via
   data-festas-url no <body>) — o restante do código permanece o mesmo.
   ========================================================================== */

(function () {
  "use strict";

  const API_URL = document.body.dataset.festasUrl || "dados/festas.json";

  document.addEventListener("DOMContentLoaded", carregarFestas);

  async function carregarFestas() {
    try {
      const festas = await fetchFestas();
      renderizarFestas(festas);
    } catch (error) {
      console.error("Falha ao carregar festas:", error);
      mostrarErro();
    }
  }

  async function fetchFestas() {
    const resposta = await fetch(API_URL, { headers: { Accept: "application/json" } });

    if (!resposta.ok) {
      throw new Error("Resposta da rede não foi ok: " + resposta.status);
    }

    const dados = await resposta.json();
    return dados.festas || [];
  }

  function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto == null ? "" : String(texto);
    return div.innerHTML;
  }

  /* Ordena as festas: futuras primeiro (da mais próxima à mais distante),
     depois as passadas (da mais recente à mais antiga). */
  function ordenarFestas(festas) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const inicioDoDia = hoje.getTime();

    return festas
      .map(function (festa) {
        return {
          festa: festa,
          timestamp: new Date(festa.data + "T00:00:00").getTime(),
        };
      })
      .sort(function (a, b) {
        const aFutura = a.timestamp >= inicioDoDia;
        const bFutura = b.timestamp >= inicioDoDia;

        if (aFutura && bFutura) return a.timestamp - b.timestamp; // próximas primeiro
        if (aFutura) return -1;
        if (bFutura) return 1;
        return b.timestamp - a.timestamp; // passadas: mais recente primeiro
      })
      .map(function (item) {
        return { festa: item.festa, timestamp: item.timestamp };
      });
  }

  function formatarDataCompleta(iso) {
    const data = new Date(iso + "T00:00:00");
    if (isNaN(data.getTime())) return iso;
    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function obterDia(iso) {
    const data = new Date(iso + "T00:00:00");
    return data.getDate();
  }

  function obterMes(iso) {
    const data = new Date(iso + "T00:00:00");
    return data.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
  }

  function renderizarFestas(festas) {
    const container = document.querySelector("[data-festas-list]");
    if (!container) return;

    container.querySelectorAll(".skeleton-card").forEach(function (sk) { sk.remove(); });
    container.innerHTML = "";

    if (!festas.length) {
      container.innerHTML =
        '<p style="color:rgba(10,31,68,.7)">Nenhuma festa cadastrada ainda. Volte em breve!</p>';
      return;
    }

    const ordenadas = ordenarFestas(festas);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const inicioDoDia = hoje.getTime();

    let marcadoProxima = false;

    ordenadas.forEach(function ({ festa, timestamp }) {
      const futura = timestamp >= inicioDoDia;

      const card = document.createElement("article");
      card.className = "card festa-card";
      if (!futura) card.classList.add("festa-past");

      let badge = "";
      if (futura && !marcadoProxima) {
        badge = '<span class="badge-proxima">Próxima festa!</span>';
        marcadoProxima = true;
      }

      let local = "";
      if (festa.local) {
        local =
          '<p class="festa-local">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>' +
          escaparHTML(festa.local) +
          "</p>";
      }

      card.innerHTML =
        '<div class="festa-date" aria-hidden="true">' +
        '<span class="dia">' + obterDia(festa.data) + "</span>" +
        '<span class="mes">' + obterMes(festa.data) + "</span>" +
        "</div>" +
        '<div class="festa-info">' +
        badge +
        "<h3>" + escaparHTML(festa.nome) + "</h3>" +
        '<p class="festa-local-data">' + escaparHTML(formatarDataCompleta(festa.data)) + "</p>" +
        local +
        "<p>" + escaparHTML(festa.descricao) + "</p>" +
        "</div>";

      container.appendChild(card);
    });
  }

  function mostrarErro() {
    const container = document.querySelector("[data-festas-list]");
    if (container) {
      container.querySelectorAll(".skeleton-card").forEach(function (sk) { sk.remove(); });
    }
    const erro = document.querySelector("[data-error]");
    if (erro) erro.hidden = false;
  }
})();
