# Douradinho 🌟

Site estático do **Douradinho** — uma entidade querida sobre quem pessoas reais contam
histórias e participam de festas e eventos comemorativos.

Projeto 100% estático: **HTML + CSS + JS puros**, sem frameworks, sem build e sem
dependências. Pronto para rodar diretamente na **Vercel**.

## ✨ Funcionalidades

- **Página inicial** (`/`) com o nome "DOURADINHO" em destaque absoluto na hero section.
- **Histórias** (`/historias`) carregadas de `dados/historias.json`, com busca em tempo
  real e leitura completa em modal acessível.
- **Festas** (`/festas`) carregadas de `dados/festas.json`, ordenadas por data com
  destaque dourado para a próxima festa.
- Tema **azul** moderno e limpo, totalmente responsivo (mobile-first).
- Acessibilidade (WCAG 2.1 AA): landmarks semânticos, foco visível, `aria-labels`,
  `prefers-reduced-motion` respeitado.

## 🗂️ Estrutura de arquivos

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
│   ├── main.js             ← Menu mobile, voltar ao topo, utilitários
│   ├── historias.js        ← Carregamento/renderização das histórias
│   └── festas.js           ← Carregamento/renderização das festas
├── dados/
│   ├── historias.json      ← Histórias reais (fácil de editar)
│   └── festas.json         ← Agenda de festas/eventos
├── assets/
│   └── favicon.svg         ← Favicon e ícones em SVG
├── vercel.json             ← cleanUrls + headers de cache
└── README.md
```

## ▶️ Como rodar localmente

### Opção 1 — Servidor estático simples (Python)

```bash
# dentro da pasta do projeto
python3 -m http.server 8080
```

Acesse <http://localhost:8080>.

### Opção 2 — Vercel CLI (recomendado)

```bash
npm install -g vercel   # apenas para uso local, não é dependência do site
vercel dev
```

Acesse a URL exibida no terminal (ex.: <http://localhost:3000>).

> ⚠️ O site **não precisa** de `npm`/build para funcionar. Ele funciona abrindo o
> `index.html` em qualquer servidor estático.

## 🚀 Como publicar na Vercel

### Deploy via Dashboard (mais simples)

1. Acesse <https://vercel.com> e faça login (GitHub, GitLab ou e-mail).
2. Clique em **"Add New…" → "Project"**.
3. Importe o repositório que contém este projeto.
4. A Vercel detecta automaticamente que é um site estático (sem framework):
   - **Framework Preset:** *Other* (ou *Vercel*)
   - **Build Command:** deixe vazio
   - **Output Directory:** deixe vazio (usa a raiz)
5. Clique em **Deploy**.

O `vercel.json` já configura `cleanUrls` (as URLs `/historias` e `/festas` funcionam
sem o `/index.html`) e headers de cache.

### Deploy via CLI

```bash
npm install -g vercel
vercel          # deploy de pré-visualização
vercel --prod   # deploy de produção
```

## ➕ Como adicionar novas histórias

Edite apenas o arquivo **`dados/historias.json`**. Basta adicionar um novo objeto no
array `"historias"`:

```json
{
  "id": "historia-006",
  "titulo": "Título da nova história",
  "autor": "Nome de quem contou",
  "data": "2026-11-05",
  "resumo": "Uma ou duas frases de resumo.",
  "conteudo": "O texto completo da história, com parágrafos separados por \\n."
}
```

- O `id` deve ser único.
- A `data` deve estar no formato `AAAA-MM-DD`.
- As histórias são ordenadas automaticamente da mais recente para a mais antiga.
- Não é necessário alterar nenhum código HTML, CSS ou JS.

### Como adicionar novas festas

Edite **`dados/festas.json`**, adicionando um objeto no array `"festas"`:

```json
{
  "id": "festa-004",
  "nome": "Nome da festa",
  "data": "2027-05-01",
  "local": "Local do evento",
  "descricao": "Descrição curta do que vai acontecer."
}
```

As festas futuras aparecem primeiro (da mais próxima à mais distante) e a primeira
futura recebe o selo dourado **"Próxima festa!"**.

## 🔌 Migrando para uma API externa (futuro)

Todo o carregamento está centralizado nas funções `fetch` de `js/historias.js` e
`js/festas.js`, com a constante `API_URL` no topo de cada arquivo.

Para trocar o JSON local por uma API, altere apenas o valor de `API_URL`
(ou o atributo `data-historias-url` / `data-festas-url` no `<body>` da página)
apontando para a URL da API — o restante do código permanece idêntico.

## 🎨 Identidade visual

Paleta azul definida via CSS Custom Properties em `css/styles.css`:

| Variável     | Cor       | Uso                                   |
|--------------|-----------|---------------------------------------|
| `--azul-900` | `#0A1F44` | Fundos de hero e rodapé               |
| `--azul-700` | `#123A7A` | Seções alternadas, cabeçalhos         |
| `--azul-500` | `#1E63C4` | Botões, links, destaques              |
| `--azul-300` | `#5B9BF0` | Hovers, gradientes, ícones            |
| `--azul-100` | `#E8F1FC` | Fundos de cards e seções suaves       |
| `--dourado`  | `#F5C542` | Acento do nome "Douradinho"           |
