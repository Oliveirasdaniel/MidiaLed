# Mídia Led — Site institucional

Site one-page de publicidade em painéis de LED, em Nova Iguaçu (RJ).
HTML, CSS e JavaScript puro — sem build, sem dependências, sem framework.

**Contato da empresa:** (21) 96617-1604 · [@midia_led_](https://www.instagram.com/midia_led_/)

## Como rodar

Abra `index.html` no navegador. Para testar com servidor local (recomendado, evita
bloqueio de autoplay em alguns navegadores):

```bash
npx serve .
# ou
python -m http.server 8000
```

## Deploy

Hospedado na Vercel como site estático. Não há etapa de build: a Vercel publica a raiz
do repositório. O `vercel.json` define apenas o cache — longo para imagens e vídeos,
curto para CSS e JS, para que as alterações de estilo apareçam na hora.

## Portal de entrada

A primeira tela (`.gate`) é um **rodízio de vídeos**: toca um, passa ao próximo com uma
transição curta pelo preto, e recomeça. Com um vídeo só na lista, ele fica em loop.

Para acrescentar um vídeo, basta somar um item em `CONFIG.portal`:

```js
portal: [
  { desktop: 'assets/video/cidade.mp4',   mobile: 'assets/video/cidade-mobile.mp4' },
  { desktop: 'assets/video/operacao.mp4', mobile: 'assets/video/operacao-mobile.mp4' }
],
trechoMaximoS: 14   // tempo de cada vídeo antes de passar ao próximo
```

`mobile` é opcional. Só o vídeo em exibição é baixado: os outros entram quando chega a vez
deles. Fora da tela, o portal pausa. Sem JS, fica o poster.

Configuração em `assets/js/main.js` → `CONFIG`:

| Opção | Efeito |
|---|---|
| `whatsapp` | Número usado no formulário e nos links (`5521966171604`) |
| `ga4Id` | Measurement ID do GA4 — vazio desliga a medição |
| `metaPixelId` | ID do Meta Pixel — vazio desliga |
| `endpointLeads` | URL que recebe os leads — vazio desliga a gravação |
| `portal` | Lista de vídeos do portal, em rodízio |
| `trechoMaximoS` | Segundos de cada vídeo antes de trocar (padrão 14) |

## Estrutura

```
MídiaLed/
├── index.html                  Página inteira
├── favicon.ico                 Monograma ML (multi-resolução)
├── vercel.json                 Cache do deploy
├── assets/                     Tudo que o site usa (7,5 MB)
│   ├── css/style.css
│   ├── js/main.js              Abertura, menu, formulário, contadores, vídeos
│   ├── js/motion.js            Movimento: texto, paralaxe, letreiro, carrossel
│   ├── img/
│   │   ├── logo-midialed.png   Logo branca transparente
│   │   ├── favicon-512.png · apple-touch-icon.png
│   │   ├── og-image.jpg        Miniatura de compartilhamento (foto real do trio)
│   │   ├── gate-poster.jpg     Primeiro quadro do vídeo de abertura
│   │   ├── trio-rua.jpg        Foto do trio na rua
│   │   ├── painel-led.png      Estrutura do painel fixo
│   │   ├── *.webp              Versão leve de cada imagem (usada por padrão)
│   │   └── clientes/           Logos dos 5 clientes (png + webp, Egide em svg)
│   └── video/                  trio-rua · conquiste · cidade · dutra · operacao · criacao
├── midias/                     Originais em tamanho cheio — FORA do Git (.gitignore)
└── docs/                       Briefings e referências
```

**Regra:** originais ficam em `midias/`, versões otimizadas em `assets/`.

## Seções

1. **Portal** — vídeo da rua, logo e indicativo de scroll
2. **Hero** — H1 de busca + "Anunciar não é aparecer. É ser visto."
3. **Letreiro de LED** — matriz de pixels com as mensagens-chave
4. **Números** — 4 telas · 250 mil veículos/dia · 2 faces
5. **Trio Mídia LedMob** — a operação, com a foto real na rua
6. **Ativos em abas** — Painel fixo (Led Dutra, filmagem aérea) × LED móvel
   (trio em circulação). Os dois em moldura que imita o painel de LED.
7. **Clientes** — carrossel de logos
8. **A estratégia começa aqui** — institucional + 4 passos, com vídeo de fundo
9. **Prova da veiculação** — pronta e comentada, esperando a imagem do relatório
10. **Criação do conteúdo** — vídeo à esquerda, membrana fosca à direita
11. **FAQ**
12. **Letreiro de LED (2ª passagem)**
13. **CTA + Contato** (formulário → WhatsApp) + **Rodapé**
14. **Painel lateral fixo** — WhatsApp e Instagram

## Camada de movimento (`assets/js/motion.js`)

Tudo roda em um único `requestAnimationFrame`, só com `transform` e `opacity`, e é
desligado inteiro por `prefers-reduced-motion`.

| Recurso | Como usar |
|---|---|
| Texto que se monta palavra por palavra | classe `split` no título |
| Gradiente que segue o cursor | variável `--gx`, nas palavras de destaque |
| Paralaxe | `data-parallax="0.06"` |
| Inclinação 3D | `data-tilt` |
| Botão magnético | automático em `.btn` |
| Foco de luz no hover | automático nos cartões |
| Barra de progresso | criada sozinha no topo |
| Letreiro que acelera com o scroll | automático |

## Manutenção

**Logos dos clientes** — ficam em `assets/img/clientes/` com nome fixo. Para trocar,
substitua o arquivo mantendo o nome.

Todas passaram por adaptação para fundo preto, com a mesma regra: **cinza e preto viram
branco, cor saturada e escura é clareada mantendo o tom, cor viva fica como está.** Sem
isso, logos como Multiplan, Pontofrio e Facility sumiriam no fundo do site.

| Cliente | Arquivo |
|---|---|
| Pontofrio | `pontofrio.webp` + `.png` |
| Multiplan | `multiplan.webp` + `.png` |
| Álamo | `alamo.webp` + `.png` |
| Ultra Academia | `ultra-academia.webp` + `.png` |
| Blindados RJ | `blindados-rj.webp` + `.png` |
| Drogaria Mais Barato | `drogaria-mais-barato.webp` + `.png` |
| Louvorzão 93 FM | `louvorzao-93fm.webp` + `.png` |
| Egide Saúde | `egide-saude.svg` |
| Facility | `facility.webp` + `.png` |
| Instituto Paulo Apóstolo | `ipa.webp` + `.png` |
| Athiones Fernandes | `athiones.webp` + `.png` |
| Up Ouro | `up-ouro.webp` + `.png` |

Para adicionar um cliente, copie um `.brandrail__item` **nos dois conjuntos** do trilho.

**Letreiro de LED** — cada letreiro tem dois `.ledstrip__set` idênticos; o segundo é a
cópia que faz o loop ser contínuo. Ao mudar uma mensagem, mude nos dois. O `motion.js`
duplica os conjuntos sozinho conforme a largura da tela.

**Vídeos** — o ffmpeg está disponível via `pip install imageio-ffmpeg`:

```bash
FF=$(python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")

"$FF" -y -i entrada.mp4 -t 24 -vf "scale=720:-2" -c:v libx264 -crf 29 -preset slow \
      -pix_fmt yuv420p -movflags +faststart -an assets/video/saida.mp4

"$FF" -y -ss 3 -i assets/video/saida.mp4 -frames:v 1 -q:v 4 assets/img/poster.jpg
```

Os vídeos saíram de 57 MB para 6,6 MB nesse processo, sem perda visível.
As versões `-mobile.mp4` têm 432px de largura e 16s.
Os originais completos continuam em `midias/videos/`.

## Desempenho em celular

O público entra pelo Instagram e pelo WhatsApp, em Android intermediário e 4G instável.
Por isso o celular é a versão principal, não a adaptada.

Medido com Lighthouse 11.7.1 (preset mobile) e Chrome emulando 360/390/430px:

| Métrica | Antes | Depois |
|---|---|---|
| Performance | sem nota (LCP falhava) | **84** |
| Peso total | 4.869 KB | **1.105 KB** |
| Vídeo baixado | 3.912 KB | **672 KB** |
| Imagens | 801 KB | **268 KB** |
| LCP | erro `NO_LCP` | 3,2 s |
| CLS | 0 | 0 |
| Alvos de toque < 44px | 18 | **0** |
| Campos com fonte < 16px | 5 | **0** |
| Conteúdo visível sem JS | nenhum | **tudo** |

### O que sustenta esses números

- **Nada depende de JS para aparecer.** As animações só entram quando o script marca
  `<html class="js">`. Se o JS falhar, o site aparece inteiro, sem animação.
- **Vídeo certo para cada tela.** Versões de 432px para celular; o JS escolhe pelo
  `matchMedia` e nunca carrega vídeo invisível (a cópia desfocada do portal é
  `display:none` no celular).
- **Conexão fraca não baixa vídeo.** Com `saveData` ligado ou `effectiveType` 2G,
  fica só o poster.
- **Imagens em WebP** com `<picture>` e fallback, `width`/`height` declarados e
  `loading="lazy"` abaixo da dobra.
- **Campos do formulário em 16px** — abaixo disso o Safari iOS dá zoom ao focar.
  Com `inputmode`, `autocomplete`, `autocapitalize` e rolagem automática ao focar.

### Limitações assumidas

- **LCP de 3,2 s** (meta: 2,5 s) e **primeira dobra acima de 1 MB**: consequência de
  manter o portal em vídeo no celular, decisão do cliente. Sem ele, ambas as metas seriam
  atingidas com folga.
- **Página com 17 telas em 360px.** Reduzi o espaçamento vertical, mas o comprimento vem
  da quantidade de conteúdo.

## Menu do celular

O painel lateral é `position: fixed`, então **nenhum ancestral dele pode ter `transform`,
`filter` ou `backdrop-filter`** — essas propriedades criam bloco de contenção e o painel
passa a se posicionar pela barra do topo em vez da janela (ele saía com 80px de altura).

Por isso, no celular o cabeçalho usa fundo sólido em vez de `backdrop-filter`, e a
animação de entrada usa `top` em vez de `transform`. Ao mexer no cabeçalho, mantenha isso.

O cabeçalho também fica **sempre visível no celular** — antes ele só aparecia depois do
portal, e a primeira tela ficava sem nenhuma navegação.

## Pendências antes de divulgar

| Item | Situação |
|---|---|
| E-mail no rodapé e no contato | `contato@midialed.com.br` — **confirmar se existe** |
| CNPJ no rodapé | ✅ 62.377.877/0001-53 |
| Fontes dos dados de mercado | 82%, 4× e 66% são referências de setor atribuídas a Nielsen e Intel/Arbitron — **conferir antes de divulgar** |
| Especificações do painel fixo | medidas, pixel pitch e horário de operação ainda genéricos |
| Logo em SVG | hoje só existe PNG transparente |
