/* ==========================================================================
   Douradinho — Utilitários globais (menu mobile, voltar ao topo, ano dinâmico)
   ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initMenuMobile();
    initBackToTop();
    initYear();
    fecharMenuAoClicarFora();
  });

  /* Menu hambúrguer (mobile) */
  function initMenuMobile() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector("[data-nav]");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      const aberto = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(aberto));
      toggle.setAttribute("aria-label", aberto ? "Fechar menu de navegação" : "Abrir menu de navegação");
    });
  }

  /* Fecha o menu se clicar fora dele */
  function fecharMenuAoClicarFora() {
    const nav = document.querySelector("[data-nav]");
    const toggle = document.querySelector("[data-menu-toggle]");

    document.addEventListener("click", function (event) {
      if (!nav || !toggle || !nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;

      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  /* Botão "voltar ao topo" */
  function initBackToTop() {
    const botao = document.querySelector("[data-back-to-top]");

    if (!botao) return;

    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        botao.classList.add("is-visible");
      } else {
        botao.classList.remove("is-visible");
      }
    }, { passive: true });

    botao.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Ano atual no rodapé */
  function initYear() {
    const el = document.querySelector("[data-year]");
    if (el) {
      el.textContent = String(new Date().getFullYear());
    }
  }
})();
