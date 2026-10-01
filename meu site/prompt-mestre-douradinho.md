# 🎯 PROMPT MESTRE — Site "Douradinho" (Pronto para Vercel)

> Copie todo o bloco abaixo e envie ao DeepSeek V4 Pro.

---

## [PAPEL]

Você é um **Engenheiro de Software Sênior especializado em Desenvolvimento Web Front-End**, com mais de 15 anos de experiência em:

- HTML5 semântico, acessibilidade (WCAG 2.1 AA) e SEO técnico;
- CSS moderno (Flexbox, Grid, Custom Properties, animações) e **Tailwind CSS**;
- JavaScript moderno (ES6+, módulos, Fetch API, manipulação de DOM);
- Arquitetura de sites estáticos e deploy na **Vercel** (incluindo configuração de rotas e rewrites);
- UI/UX com foco em design limpo, responsivo e performático (Core Web Vitals).

Seu trabalho é sempre **completo, funcional e pronto para produção** — sem placeholders vagos, sem trechos incompletos e sem depender de bibliotecas pagas.

---

## [CONTEXTO]

Vou construir um site estático chamado **"Douradinho"**. Douradinho é uma entidade/personagem sobre o qual pessoas reais contam histórias e participam de festas e eventos comemorativos.

O site precisa:

1. Ser **100% estático** (HTML + CSS + JS puro, sem frameworks de build obrigatórios) para funcionar perfeitamente na **Vercel** sem processo de build;
2. Suportar **subpáginas reais por rota de diretório**:
   - Página inicial: `/` (raiz)
   - Página de histórias: `/historias` → arquivo `historias/index.html`
   - Página de festas: `/festas` → arquivo `festas/index.html`
3. Exibir **histórias reais enviadas por pessoas** (inicialmente carregadas de um arquivo JSON local, com arquitetura pronta para migrar para uma API externa depois);
4. Ter identidade visual **predominantemente AZUL**, moderna, limpa e memorável;
5. Ter na página inicial o nome **"DOURADINHO"** em destaque absoluto, como elemento dominante da hero section (primeira coisa que qualquer visitante vê).

O projeto será hospedado na Vercel na raiz do repositório, portanto os caminhos internos devem ser **relativos ou absolutos a partir da raiz do site**, funcionando tanto em `https://meudominio.vercel.app/` quanto em subdiretórios de preview.

---

## [REQUISITOS DE DESIGN]

### Paleta de cores (tema AZUL predominante)

Use **CSS Custom Properties** (ou variáveis do Tailwind) com esta paleta:

```css
:root {
  --azul-900: #0A1F44;  /* Azul-marinho profundo — fundos de hero e rodapé */
  --azul-700: #123A7A;  /* Azul escuro — seções alternadas, cabeçalhos */
  --azul-500: #1E63C4;  /* Azul principal — botões, links, destaques */
  --azul-300: #5B9BF0;  /* Azul claro — hovers, gradientes, ícones */
  --azul-100: #E8F1FC;  /* Azul gelo — fundos de cards e seções suaves */
  --branco:   #FFFFFF;  /* Texto sobre azul-escuro, cartões */
  --dourado:  #F5C542;  /* Acento complementar ao nome "Douradinho" (usar com parcimônia) */
}
```

### Hero section da página inicial (exigência crítica)

- O nome **"DOURADINHO"** deve ser o elemento visual mais dominante da página: tipografia display gigante (clamp para responsividade, ex.: `clamp(3rem, 12vw, 9rem)`), peso extra-bold, com efeito premium (ex.: gradiente azul-claro→branco, text-shadow sutil ou contorno dourado discreto);
- Fundo da hero: gradiente azul profundo (--azul-900 → --azul-700) com padrão decorativo sutil (formas geométricas, ondas SVG ou partículas CSS — sem imagens pesadas);
- Subtítulo e botão de call-to-action ("Ver Histórias") logo abaixo do título;
- Animação de entrada suave (fade/slide-up) no carregamento.

### Estilo geral

- **Modern clean**: muito espaço em branco, cantos arredondados (8–16px), sombras suaves, hierarquia tipográfica clara;
- Tipografia: fonte do Google Fonts (ex.: "Poppins" ou "Outfit" para títulos + "Inter" para corpo);
- **Layout totalmente responsivo**: mobile-first, testado em 360px, 768px e 1440px;
- Header fixo (sticky) com navegação, logo/texto "Douradinho" à esquerda e links (Início, Histórias, Festas) à direita; em mobile, menu hambúrguer funcional;
- Estado ativo do link de navegação destacado conforme a página atual;
- Cards com hover states, transições suaves (0.2–0.3s) e `prefers-reduced-motion` respeitado;
- Rodapé azul-marinho com links das três rotas e espaço para redes sociais;
- Acessibilidade: contraste AA, `alt` em imagens, foco visível em navegação por teclado, landmarks semânticos (`header`, `nav`, `main`, `section`, `article`, `footer`).

---

## [FUNCIONALIDADES]

### 1. Estrutura de arquivos obrigatória

```
/
├── index.html              ← Página inicial (hero "DOURADINHO")
├── historias/
│   └── index.html          ← Rota /historias
├── festas/
│   └── index.html          ← Rota /festas
├── css/
│   └── styles.css          ← Estilos globais (tema azul)
├── js/
│   ├── main.js             ← Menu mobile, animações, utilitários globais
│   ├── historias.js        ← Carregamento e renderização das histórias
│   └── festas.js           ← Carregamento e renderização das festas
├── dados/
│   ├── historias.json      ← Base inicial de histórias reais
│   └── festas.json         ← Base inicial de festas/eventos
├── assets/
│   └── (svg/favicon)       ← Favicon e ícones em SVG
├── vercel.json             ← Configuração opcional (cleanUrls, headers de cache)
└── README.md               ← Como rodar local e como publicar na Vercel
```

### 2. Página inicial (`/`)

- Hero com **"DOURADINHO"** em destaque absoluto + tagline + CTA;
- Seção "Destaques" com 3 cards de resumo (Histórias, Festas, Sobre);
- Seção que exibe as **3 histórias mais recentes** carregadas via `fetch` de `dados/historias.json`, com link "Ver todas as histórias" → `/historias`;
- Seção institucional breve sobre o Douradinho (texto ilustrativo, fácil de editar).

### 3. Página `/historias`

- Grade de cards (grid responsivo) com todas as histórias vindas de `dados/historias.json`;
- Cada card: título, autor, data, resumo e botão "Ler história" que abre a história completa em um **modal acessível** (sem recarregar a página);
- Campo de **busca por texto** (filtro client-side em tempo real por título/autor/conteúdo);
- Estado de carregamento (skeleton/spinner) e mensagem amigável se o `fetch` falhar.

### 4. Página `/festas`

- Lista/grid de festas e eventos vindos de `dados/festas.json`;
- Cada item: nome da festa, data, local e descrição;
- Ordenação por data (mais próximas primeiro quando a data é futura);
- Destaque visual para eventos futuros (badge "Próxima festa!") usando o acento dourado.

### 5. Integração de histórias reais (arquitetura de dados)

- Estrutura do `dados/historias.json`:

```json
{
  "historias": [
    {
      "id": "historia-001",
      "titulo": "Título da história real",
      "autor": "Nome de quem contou",
      "data": "2026-09-15",
      "resumo": "Resumo em uma ou duas frases.",
      "conteudo": "Texto completo da história real..."
    }
  ]
}
```

- Todo o carregamento centralizado em funções `fetch` reutilizáveis em `js/historias.js`, com tratamento de erro (`try/catch`) e constante `API_URL` no topo do arquivo — assim, no futuro, basta trocar o caminho do JSON por uma URL de API sem alterar o resto do código;
- Adicionar novas histórias deve exigir **apenas editar o JSON** (documentar isso no README).

### 6. Navegação fluida

- Header idêntico nas 3 páginas com links relativos corretos (`/`, `/historias/`, `/festas/`);
- Botão "voltar ao topo" flutuante;
- Navegação totalmente funcional por teclado e com `aria-label`s;
- Sem links quebrados: todos os caminhos internos devem funcionar na Vercel exatamente como em `localhost`.

---

## [FORMATO DE SAIDA]

Entregue a resposta EXATAMENTE nesta ordem:

1. **Visão geral do projeto** — máximo 5 linhas.
2. **Árvore de arquivos completa** em um bloco de código.
3. **Código de cada arquivo**, um bloco de código por arquivo, precedido do caminho do arquivo como cabeçalho, nesta ordem:
   1. `index.html`
   2. `historias/index.html`
   3. `festas/index.html`
   4. `css/styles.css`
   5. `js/main.js`
   6. `js/historias.js`
   7. `js/festas.js`
   8. `dados/historias.json` (com **5 histórias de exemplo realistas** sobre o Douradinho)
   9. `dados/festas.json` (com **3 festas de exemplo realistas**)
   10. `vercel.json`
   11. `README.md` (instruções de rodar localmente com `vercel dev` ou servidor estático, e passo a passo de deploy na Vercel, incluindo como adicionar novas histórias)
4. **Checklist final** — lista das exigências atendidas (Vercel ✓, tema azul ✓, hero Douradinho ✓, rotas ✓, histórias via JSON ✓).

### Regras rígidas de entrega

- **Código 100% completo e funcional** — nenhum `// ... resto do código aqui`, nenhum trecho omitido;
- Zero dependências de build: nada de npm, bundler ou frameworks — apenas HTML, CSS, JS e JSON nativos;
- Nenhum arquivo de imagem binária: use apenas CSS, SVG inline e gradientes;
- Todos os arquivos com codificação UTF-8 e acentuação correta em português;
- Comentários no código apenas onde agregam valor (em português).

---

*Fim do prompt mestre.*
