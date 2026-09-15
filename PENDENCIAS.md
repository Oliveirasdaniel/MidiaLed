# Pendências — dados que faltam do cliente

Nada aqui foi preenchido com valor fictício. Cada item diz o que falta, onde entra
e o que o site está fazendo enquanto o dado não chega.

Última atualização: 15/09/2026 · Ajustes do comprador + refatoração mobile.

---

## Bloqueando agora (já afetam o que está no ar)

### 1. CNPJ
- **Onde entra:** rodapé, ao lado do copyright (`index.html`, seção `.footer__bottom`).
- **Situação:** a linha com `00.000.000/0001-00` foi **removida**. No lugar ficou um
  comentário `<!-- PENDENTE: aguardando CNPJ do cliente -->`.
- **Para resolver:** informe o CNPJ e ele volta como `<span>CNPJ XX.XXX.XXX/0001-XX</span>`.

### 2. Fontes dos dados de mercado (82% / 4× / 66%)
- **Situação:** a seção inteira foi **removida** do site, porque as fontes não foram
  confirmadas. O conteúdo está preservado no histórico do Git.
- **Para trazer de volta:** informe estudo, ano e link de cada número. Ela volta com a
  citação completa visível, que é mais forte do que o número solto.

---

## Esperando dado para implementar

### 3. Faixa de preço de entrada
- **Onde entra:** linha discreta abaixo do CTA principal do hero.
- **Formato:** "Campanhas a partir de R$ X a diária".
- **Situação:** não implementado. Sem valor real, não há o que escrever.
- **Por que importa:** hoje quem não tem noção de preço some sem perguntar. Uma faixa de
  entrada filtra quem não tem orçamento e tranquiliza quem tem.
- **Observação:** a FAQ explica por que não existe tabela de preços e deve continuar assim.
  A âncora de preço não conflita com isso — ela dá ordem de grandeza, não tabela.

### 4. GA4 Measurement ID e Meta Pixel ID
- **Onde entra:** `CONFIG.ga4Id` e `CONFIG.metaPixelId`, no topo de `assets/js/main.js`.
- **Situação:** **estrutura pronta e desligada.** Os eventos já estão todos programados;
  basta colar os IDs e tudo passa a medir sozinho. Sem ID, nenhum script de terceiro é
  baixado — o site não fica mais lento por causa disso.
- **Eventos já programados:** `clique_cta` (com o rótulo de cada botão), `envio_formulario`,
  `clique_whatsapp` (separando botão flutuante, rodapé e página), `clique_instagram`,
  `clique_email` e `rolagem` (25/50/75/100%).
- **Para resolver:** crie a propriedade no Google Analytics (ID no formato `G-XXXXXXXXXX`)
  e o pixel no Meta Business (ID numérico).

### 5. Endpoint para gravação de leads
- **Onde entra:** `CONFIG.endpointLeads`, no topo de `assets/js/main.js`.
- **Situação:** **função `salvarLead()` implementada e desligada.** Assim que houver
  endpoint, todo lead é gravado antes do redirecionamento. A gravação falha em silêncio:
  se o serviço cair, o visitante nem percebe e o WhatsApp abre do mesmo jeito.
- **Opções (da mais simples para a mais completa):**
  - **Formspree** — conta grátis, cria o endpoint em 2 minutos, o lead chega por e-mail.
    Cole a URL (`https://formspree.io/f/xxxxxxx`) em `CONFIG.endpointLeads` e pronto;
  - **Google Sheets via Apps Script** — grava numa planilha;
  - **Webhook próprio.**

### 6. Endereço e coordenadas exatas do painel fixo
- **Onde entra:** seção do painel fixo — mapa com o pin e link para o Google Maps.
- **Situação:** **bloco do mapa e da foto pronto e comentado no HTML.** Procure por
  `PENDENTE: aguardando coordenadas exatas`. Troque `LAT,LON` no link e coloque a
  imagem do mapa em `assets/img/painel-mapa.jpg`.
- **Para resolver:** abra o Google Maps no ponto do painel, clique com o botão direito
  e copie as coordenadas (ex.: `-22.7590, -43.4510`).

### 13. Endereço da empresa
- **Onde entra:** JSON-LD `LocalBusiness` no `<head>` e Google Business Profile.
- **Situação:** o JSON-LD atual declara só telefone, cidade atendida e Instagram.
  Sem endereço, o Google não mostra o cartão lateral de empresa na busca.
- **Se não houver endereço comercial aberto ao público**, isso é normal para mídia
  exterior — nesse caso mantemos `areaServed` sem `address`, e sinalizamos isso.

### 8. Horário de atendimento
- **Onde aparece:** seção de contato ("Seg a Sex, 09h às 18h").
- **Situação:** esse horário foi escrito por mim, não confirmado por você. Está publicado.
  Por isso foi deixado **fora** do JSON-LD: declarar horário errado para o Google é pior
  do que não declarar.
- **Para resolver:** confirme o horário real e ele entra também nos dados estruturados.

### 8b. E-mail de contato
- **Onde entra:** seção de contato e rodapé.
- **Situação:** está publicado `contato@midialed.com.br`. **Esse e-mail existe?**
  Se não existir, alguém pode escrever e nunca ser respondido — pior do que não ter e-mail.

---

## Pedidos do comprador que ficaram esperando arquivo

### A. Vídeo do painel fixo — ✅ RESOLVIDO em 15/09
- O vídeo "Conquiste mais oportunidades" entrou no lugar do render 3D, dentro de uma
  moldura que imita o próprio painel. Sem som, como pedido.
- 39,8 MB → **2,5 MB** (desktop) e **1,2 MB** (celular), sem áudio.
- O render `painel-led.png` saiu do site (segue em `midias/fotos/`).

### B. Novos clientes para o carrossel
- **Situação:** **nomes e logos não chegaram.** O carrossel segue com os cinco atuais:
  Blindados RJ, Álamo, Egide Saúde, Louvorzão 93 FM e Drogaria Mais Barato.
- **Do que preciso:** a lista de nomes e, se possível, os arquivos das logos.
  Sem o arquivo, entra o nome escrito em placa — e a logo substitui depois, sozinha.
- **Observação:** as logos precisam de adaptação para fundo preto. As cinco atuais
  passaram por isso (Blindados virou branca, Álamo teve o nome clareado, Egide teve
  o verde clareado). Faço o mesmo com as novas.

### C. Mais vídeos para o portal de entrada
- **Situação:** **implementado e funcionando** com os dois vídeos que já existiam.
  O portal agora toca um vídeo depois do outro, em rodízio.
- **Para acrescentar:** me mande os arquivos. No código é uma linha por vídeo,
  em `CONFIG.portal` no topo de `assets/js/main.js`.

---

## Esperando material

### 9. Depoimentos de clientes
- **Onde entra:** seção de clientes, abaixo do carrossel de logos.
- **Formato:** até 2 em destaque, com nome da pessoa, empresa e foto.
- **Situação:** **estrutura e CSS prontos, comentados no HTML.** Procure por
  `PENDENTE: aguardando depoimentos reais`. Ao receber, troque NOME/EMPRESA/TEXTO,
  coloque a foto em `assets/img/depoimentos/` e apague as duas linhas de comentário.
- **Observação:** um depoimento de qualquer um dos cinco clientes atuais — Blindados RJ,
  Álamo, Egide Saúde, Louvorzão 93 FM ou Drogaria Mais Barato — vale mais que qualquer
  texto de vendas do site.

### 10. Imagem do relatório de veiculação
- **Arquivo esperado:** `assets/img/relatorio-exemplo.jpg`.
- **Onde entra:** ao lado da promessa "registramos toda a veiculação em foto e vídeo".
- **Situação:** **seção inteira pronta e comentada no HTML** (`id="prova"`). Procure por
  `PENDENTE: aguardando a imagem do relatório`. Ao colocar o arquivo, apague as duas
  linhas de comentário e a seção entra no ar.
- **Por que importa:** é o principal argumento de confiança do site e o único sem prova
  visual. Um print do relatório, com dados sensíveis borrados, resolve.

### 11. Foto do painel fixo na perspectiva de quem dirige
- **Arquivo esperado:** `assets/img/painel-dirigindo.jpg`.
- **Onde entra:** seção do painel fixo, ao lado do mapa (bloco já pronto e comentado).
- **Situação:** hoje a seção usa só um render 3D da estrutura, que não transmite o impacto
  real de quem passa na Dutra.

### 12. Foto do painel fixo aceso à noite
- **Situação:** não pedida no prompt, mas é a imagem que falta para o site inteiro.
  Vale mais que qualquer ajuste de código que sobrou na lista.

---

## Itens do prompt que já estavam resolvidos

Verificado no código antes de mexer — estes não precisaram de alteração:

| Item do prompt | Situação real |
|---|---|
| 5. "Botão flutuante de WhatsApp não existe" | Existe desde a segunda rodada: `<aside class="dock">`, fixo, WhatsApp + Instagram, visível em toda a rolagem. Na Fase 1 foi corrigida a sobreposição no celular. |
| 7. "Clientes em texto corrido" | As cinco logos já estão no ar em carrossel, adaptadas para fundo preto. |
| 10. "Tornar Empresa e Mensagem opcionais" | Já eram opcionais; só Nome e WhatsApp são obrigatórios. |
| 10. "Máscara no campo de WhatsApp" | Já existe em `main.js`. |
| 16. "Comprimir vídeos" | Já feito: de 57 MB para 6,6 MB. Falta só `preload="none"` e posters. |
