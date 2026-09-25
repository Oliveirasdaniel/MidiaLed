# Pendências — dados que faltam do cliente

Nada aqui foi preenchido com valor fictício. Cada item diz o que falta, onde entra
e o que o site está fazendo enquanto o dado não chega.

Última atualização: 24/09/2026 · revisão geral: área atendida passa a ser o estado do RJ,
itens abaixo conferidos com o que está no ar.

---

## Bloqueando agora (já afetam o que está no ar)

### 1. CNPJ — ✅ RESOLVIDO em 15/09
- `62.377.877/0001-53`, publicado no rodapé.

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
- **Observação:** a âncora de preço dá ordem de grandeza, não tabela. A FAQ que explicava
  a ausência de tabela saiu do site em 22/09.

### 4. GA4 Measurement ID e Meta Pixel ID
- **Onde entra:** `CONFIG.ga4Id` e `CONFIG.metaPixelId`, no topo de `assets/js/main.js`.
- **Situação:** **estrutura pronta e desligada.** Os eventos já estão todos programados;
  basta colar os IDs e tudo passa a medir sozinho. Sem ID, nenhum script de terceiro é
  baixado — o site não fica mais lento por causa disso.
- **Eventos já programados:** `clique_cta` (com o rótulo de cada botão), `quiz_resposta`
  (cada resposta do quiz de contato), `envio_formulario`,
  `clique_whatsapp` (separando botão flutuante, rodapé e página), `clique_instagram`,
  `clique_facebook`, `clique_tiktok`, `clique_email` e `rolagem` (25/50/75/100%).
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
- **Onde entra:** JSON-LD `AdvertisingAgency` no `<head>` e Google Business Profile.
- **Situação:** o JSON-LD atual declara telefone, e-mail, área atendida (estado do Rio de Janeiro)
  e as redes (Instagram, Facebook e TikTok).
  Sem endereço, o Google não mostra o cartão lateral de empresa na busca.
- **Se não houver endereço comercial aberto ao público**, isso é normal para mídia
  exterior — nesse caso mantemos `areaServed` sem `address`, e sinalizamos isso.

### 8. E-mail e horário de atendimento — ✅ RESOLVIDO em 15/09, e-mail volta em 25/09
- Em 15/09 os dois saíram do site, por decisão do cliente. O e-mail `contato@midialed.com.br`
  nunca foi confirmado e o horário tinha sido escrito por mim.
- Em 25/09 o cliente mandou o e-mail oficial: **`contatoledmob@gmail.com`**. Ele está no
  rodapé (em "Contato e redes", logo abaixo do WhatsApp) e no JSON-LD do `<head>`.
- O horário continua fora. No lugar ficou **"respondemos o mais rápido possível"**,
  no rodapé e embaixo do botão de enviar do formulário.

---

## Pedidos do comprador que ficaram esperando arquivo

### A. Vídeo do painel fixo — ✅ RESOLVIDO em 15/09
- O vídeo "Conquiste mais oportunidades" entrou no lugar do render 3D, dentro de uma
  moldura que imita o próprio painel. Sem som, como pedido. Depois foi trocado pela
  filmagem aérea do Led Dutra (`dutra.mp4`); o Conquiste foi para o portal.
- 39,8 MB → **2,5 MB** (desktop) e **1,2 MB** (celular), sem áudio.
- O render `painel-led.png` saiu do site (segue em `midias/fotos/`).

### B. Novos clientes — ✅ RESOLVIDO em 15/09
- O carrossel passou de 5 para **12 clientes**. Entraram: Pontofrio, Multiplan,
  Ultra Academia, Facility, Instituto Paulo Apóstolo, Athiones Fernandes e Up Ouro.
- Em 22/09 foi para **20**, com Canto pela Paz, Viradão Gospel Rio,
  Rede Globo, Unicesumar, Super Ki Barato, SK Atacarejo, CEIZS e Asspontec.
- Em 24/09 foi para **21**, com a Marcha para Jesus logo depois da Globo. A logo
  veio em fundo preto com brilho: o preto virou transparência e o brilho ficou.
- Em 25/09 foi para **25**, com Macro Seminovos, Amparo Consultoria em Seguros,
  Tintas MC e Playfibra no fim do carrossel. A Tintas MC tinha uma placa preta atrás
  do nome (saiu) e o nome da Playfibra era cinza-escuro (virou branco).
- Todas as sete foram adaptadas para fundo preto. O arquivo do Up Ouro veio em AVIF
  (formato que nem toda ferramenta lê) e foi convertido.
- **Se houver mais clientes, é só mandar** — nome e logo, ou só o nome.

### C. Vídeos do portal — ✅ RODANDO com três
- Ordem atual: **trio na rua (principal)** → Conquiste mais oportunidades → cidade.
  Cada um toca inteiro e passa ao próximo (`segundosPorVideo: 0`).
- **Para acrescentar ou reordenar:** uma linha por vídeo em `CONFIG.portal`,
  no topo de `assets/js/main.js`.

### D. "super intro.mp4" — sem destino definido
- **Situação:** o arquivo chegou junto com os outros, mas não foi pedido para lugar
  nenhum. Está parado em `midias/videos/`, fora do site.
- **Me diga onde ele entra** (portal? alguma seção?) que eu comprimo e coloco.

---

## Esperando material

### 14. Original do vídeo "Conquiste mais oportunidades"
- **Onde entra:** segundo vídeo do portal (`assets/video/conquiste.mp4`).
- **Situação:** em 23/09 os outros vídeos foram refeitos a partir dos originais, em
  qualidade bem maior. Este não pôde ser refeito porque o arquivo original não está em
  `midias/videos/`: ele continua em 540px e aparece mais borrado que os outros.
- **Para resolver:** mande o vídeo original (o arquivo que saiu da câmera ou da edição,
  não o baixado do Instagram) e eu refaço igual aos outros.

### 9. Depoimentos de clientes
- **Onde entra:** seção de clientes, abaixo do carrossel de logos.
- **Formato:** até 2 em destaque, com nome da pessoa, empresa e foto.
- **Situação:** **estrutura e CSS prontos, comentados no HTML.** Procure por
  `PENDENTE: aguardando depoimentos reais`. Ao receber, troque NOME/EMPRESA/TEXTO,
  coloque a foto em `assets/img/depoimentos/` e apague as duas linhas de comentário.
- **Observação:** um depoimento de qualquer cliente do carrossel vale mais que qualquer
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
- **Situação:** hoje a seção usa a filmagem aérea do Led Dutra. Falta a visão de quem
  passa de carro, que é a que o anunciante imagina.

### 12. Foto do painel fixo aceso à noite
- **Situação:** não pedida no prompt, mas é a imagem que falta para o site inteiro.
  Vale mais que qualquer ajuste de código que sobrou na lista.

---

## Itens do prompt que já estavam resolvidos

Registro de 15/09, verificado no código antes de mexer. Desde então o formulário virou
quiz (sem campos de nome e telefone, e sem máscara) e o dock ficou só com o WhatsApp.

| Item do prompt | Situação real |
|---|---|
| 5. "Botão flutuante de WhatsApp não existe" | Existe desde a segunda rodada: `<aside class="dock">`, fixo, WhatsApp + Instagram, visível em toda a rolagem. Na Fase 1 foi corrigida a sobreposição no celular. |
| 7. "Clientes em texto corrido" | As cinco logos já estão no ar em carrossel, adaptadas para fundo preto. |
| 10. "Tornar Empresa e Mensagem opcionais" | Já eram opcionais; só Nome e WhatsApp são obrigatórios. |
| 10. "Máscara no campo de WhatsApp" | Já existe em `main.js`. |
| 16. "Comprimir vídeos" | Já feito: de 57 MB para 6,6 MB. Falta só `preload="none"` e posters. |
