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

## Como a abertura funciona

1. **Abertura** — a logo se forma em velocidade acelerada (2,05×, ~4,9s) e sai de cena
   sozinha. Sem botão de pular, sem "clique aqui".
2. **Portal (`.gate`)** — o vídeo da rua assume e fica rodando em loop com a logo e o
   indicativo *"Role para baixo"*, até o visitante rolar.
3. Qualquer scroll, toque ou tecla durante a abertura já a encerra — ninguém fica preso.
4. A abertura roda **uma vez por sessão**.

O vídeo da rua é vertical. **No desktop ele preenche a tela inteira** (`object-fit: cover`);
**no celular** aparece no formato natural, ocupando a tela.

Ajustes rápidos em `assets/js/main.js` → `CONFIG`:

| Opção | Efeito |
|---|---|
| `whatsapp` | Número usado no formulário e nos links (`5521966171604`) |
| `velocidadeAbertura` | Quantas vezes mais rápido a logo se forma (padrão `2.05`) |
| `limiteAberturaMs` | Trava de segurança: nunca prende mais que isso (padrão 6,2s) |
| `aberturaUmaVezPorSessao` | `true` não repete a abertura a cada navegação interna |

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
│   │   └── clientes/           Logos dos 5 clientes
│   └── video/                  cidade · operacao · criacao · logo-reveal (6,6 MB)
├── midias/                     Originais em tamanho cheio — FORA do Git (.gitignore)
└── docs/                       Briefings e referências
```

**Regra:** originais ficam em `midias/`, versões otimizadas em `assets/`.

## Seções

1. **Abertura + Portal** — logo acelerada, depois o vídeo da rua
2. **Hero** — "Anunciar não é aparecer. É ser visto."
3. **Letreiro de LED** — matriz de pixels com as mensagens-chave
4. **Números** — 4 telas · 250 mil veículos/dia · 2 faces
5. **Trio Mídia LedMob** — o que é a operação
6. **Sobre** — com a foto real do trio na rua
7. **Dados de mercado** — eficácia da mídia exterior
8. **Painel fixo** — LED duplo na Via Dutra, Nova Iguaçu
9. **Clientes** — carrossel de logos
10. **A estratégia começa aqui** — com vídeo de fundo
11. **Criação do conteúdo** — vídeo à esquerda, membrana fosca à direita
12. **FAQ**
13. **Letreiro de LED (2ª passagem)**
14. **CTA + Contato** (formulário → WhatsApp) + **Rodapé**
15. **Painel lateral fixo** — WhatsApp e Instagram

## Camada de movimento (`assets/js/motion.js`)

Tudo roda em um único `requestAnimationFrame`, só com `transform` e `opacity`, e é
desligado inteiro por `prefers-reduced-motion`.

| Recurso | Como usar |
|---|---|
| Texto que se monta palavra por palavra | classe `split` no título |
| Letra que acende quando o mouse passa | automático em `.split` e no letreiro |
| Gradientes que seguem o cursor | variável `--gx`, aplicada a todo texto colorido |
| Paralaxe | `data-parallax="0.06"` |
| Inclinação 3D | `data-tilt` |
| Botão magnético | automático em `.btn` |
| Foco de luz no hover | automático nos cartões |
| Barra de progresso | criada sozinha no topo |
| Letreiro que acelera com o scroll | automático |

## Manutenção

**Logos dos clientes** — ficam em `assets/img/clientes/` com nome fixo. Para trocar,
substitua o arquivo mantendo o nome. As cinco foram adaptadas para o fundo preto
(Blindados virou versão branca, Álamo teve o nome clareado, Egide teve o verde clareado).

| Cliente | Arquivo |
|---|---|
| Blindados RJ | `blindados-rj.png` |
| Álamo | `alamo.png` |
| Egide Saúde | `egide-saude.svg` |
| Louvorzão 93 FM | `louvorzao-93fm.png` |
| Drogaria Mais Barato | `drogaria-mais-barato.png` |

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

Os quatro vídeos saíram de 57 MB para 6,6 MB nesse processo, sem perda visível.
Os originais completos continuam em `midias/videos/`.

## Pendências antes de divulgar

| Item | Situação |
|---|---|
| E-mail no rodapé e no contato | `contato@midialed.com.br` — **confirmar se existe** |
| CNPJ no rodapé | zerado |
| Fontes dos dados de mercado | 82%, 4× e 66% são referências de setor atribuídas a Nielsen e Intel/Arbitron — **conferir antes de divulgar** |
| Especificações do painel fixo | medidas, pixel pitch e horário de operação ainda genéricos |
| Logo em SVG | hoje só existe PNG transparente |
