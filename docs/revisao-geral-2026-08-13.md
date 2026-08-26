# Revisão geral do projeto — 13/08/2026

## Objetivo e escopo

Este documento registra uma revisão técnica do estado atual do front-end **Luz Violeta Macramê** para o Daniel validar e transformar em plano de correção. O escopo incluiu código Angular, rotas, autenticação, catálogo, carrinho, pagamento, frete, PWA, acessibilidade, testes, build, dependências e preparação para entrega via GitHub.

O repositório contém apenas o front-end. Qualquer conclusão sobre autorização real, cálculo de valores, persistência, webhooks e idempotência precisa ser confirmada também no back-end/API.

## Atualização de contexto - 16/08/2026

- O PDF técnico histórico foi retirado do Git por decisão de Daniel e permanece apenas em `.local/references/`; este relatório Markdown é a revisão técnica versionada.
- O Manual de Marca 2024, fornecido por Camila, definiu a paleta digital `#523A82`, `#9286B2`, `#C4BDAD`, `#EFEBE6` e `#B5A07D`. Os tokens Sass e cores avulsas dos formulários de produto foram alinhados a essa fonte.
- As tipografias oficiais são Arches para títulos e Neulis para textos longos. A aplicação efetiva aguarda arquivos licenciados; o repositório não contém fontes ou arquivos oficiais de logo.
- O Trello autenticado confirma `Product` em desenvolvimento (3/8), `Home Page` aguardando (0/5), PagBank pausado em problemas (0/5) e um problema novo de carrinho para redirecionar o card ao produto (0/1). Esses estados reforçam o diagnóstico, mas não substituem a verificação do código.

As conclusões técnicas abaixo permanecem vigentes; a atualização visual não corrige os bloqueios de build, testes, autenticação, carrinho ou checkout.

## Resultado executivo

**Situação atual: não recomendado para produção ou para receber pagamentos reais.**

Há cinco bloqueios imediatos:

1. o build de produção falha no budget de estilos;
2. a suíte de testes não compila;
3. autenticação e autorização não formam um fluxo funcional e seguro;
4. o carrinho tem operações centrais quebradas;
5. o checkout/pagamento está incompleto e marca a venda como concluída antes da confirmação financeira.

Além disso, a auditoria de dependências encontrou **19 avisos em dependências de produção: 12 altos, 6 moderados e 1 baixo**. Não foram encontrados avisos críticos pelo `pnpm audit --prod`.

## Método e comandos executados

| Verificação | Resultado |
|---|---|
| CodeRabbit CLI no Windows | não instalado |
| WSL, necessário para o CLI oficial no Windows | não instalado |
| `npm run build` | falhou no budget de `product.component.sass`; chegou normalmente ao Angular |
| `pnpm exec tsc --noEmit -p tsconfig.app.json` | passou para o grafo alcançável por `src/main.ts` |
| `npm test -- --watch=false --browsers=ChromeHeadless` | falhou na compilação TypeScript dos testes |
| `pnpm audit --prod` | 12 altos, 6 moderados, 1 baixo, 0 críticos |
| inspeção estática manual | achados detalhados abaixo |

### Por que o CodeRabbit não foi executado

O executável `cr`/`coderabbit` não existe na máquina e o WSL também não está instalado. A documentação oficial orienta usar WSL no Windows, instalar o CLI e autenticar com `coderabbit auth login`. Além disso, o CLI analisa principalmente alterações de código rastreadas pelo Git; as mudanças produzidas neste branch são documentos ainda não rastreados, portanto uma execução agora não substituiria a revisão integral deste relatório.

Referências: [CodeRabbit no Windows/WSL](https://docs.coderabbit.ai/cli/wsl-windows), [referência do CLI](https://docs.coderabbit.ai/cli/reference) e [integração com Codex](https://docs.coderabbit.ai/cli/codex-integration).

## Critério de prioridade

- **Bloqueador:** impede entrega, quebra uma jornada principal ou cria risco incompatível com pagamento/produção.
- **Alto:** pode causar falha funcional importante, exposição de operação administrativa ou vulnerabilidade relevante.
- **Médio:** causa comportamento incorreto, dívida técnica significativa, acessibilidade insuficiente ou manutenção arriscada.
- **Baixo:** melhoria estrutural, de consistência ou qualidade sem impacto imediato na jornada principal.

## Bloqueadores

### B-01 — O build de produção falha — resolvido em 24/08/2026

**Evidência:** o `npm run build` chegou ao compilador Angular, mas `src/app/product/product.component.sass` gerou 5,13 kB e ultrapassou o limite de erro de 4 kB. Também houve avisos em `cart.component.sass` (2,61 kB) e `carousel.component.sass` (2,19 kB). Os limites estão em `angular.json:44-54`.

**Impacto:** não existe artefato de produção validado para publicar. Trocar pnpm por npm não altera a causa.

**Correção sugerida:** reduzir/compartilhar os estilos dos componentes ou ajustar os budgets de forma deliberada e justificada. Não apenas aumentar o limite sem entender o crescimento.

**Aceite:** `npm run build` termina com código 0 e sem warnings de budget aceitos por acidente.

**Resolução (24/08/2026):** sem mudar os limites, o Sass foi reorganizado para reduzir seletores redundantes. O build passou; Product caiu para 3,82 kB, Cart e Delete Product ficaram abaixo do aviso de 2 kB e o carrossel placeholder, sem uso funcional, foi removido. Product ainda gera aviso acima de 2 kB, deliberadamente mantido para uma otimização posterior sem mudança visual ampla.

### B-02 — A suíte de testes não compila

**Evidência:** `npm test -- --watch=false --browsers=ChromeHeadless` falhou com:

- `src/app/services/payments/crud-payments/crud-payments.service.spec.ts:6`: `CrudPaymentsService<T>` sem argumento genérico;
- `src/app/services/products/crud-products/crud-products.service.spec.ts:6`: `CrudProductsService<T>` sem argumento genérico;
- `src/app/services/payments/crud-payments/crud-payments.service.ts:54`: acesso a `response.data`, inexistente em `BaseAPI<T>` (`src/app/interfaces/base-api.interface.ts:3-5`).

O `tsc` da aplicação passa porque `tsconfig.app.json:10-15` parte somente de `src/main.ts`; o serviço de pagamentos quebrado não está no grafo principal atual.

**Impacto:** a automação não detecta regressões e há código inválido escondido fora do fluxo carregado pela aplicação.

**Correção sugerida:** decidir o contrato real de `BaseAPI`, tipar as specs e testar classes concretas em vez de tentar injetar abstrações genéricas.

**Aceite:** testes compilam e executam em modo headless; adicionar ao menos testes de autenticação, carrinho, produto, frete e checkout.

### B-03 — Autenticação e autorização não protegem as operações

**Evidência:**

- `src/app/guards/auth.guard.ts:5-14` ignora o estado do `AuthService`, redireciona sempre e retorna `false`;
- o guard é importado em `src/app.routes.ts:2`, mas nenhuma rota em `src/app.routes.ts:4-42` usa `canActivate`;
- dashboard, perfil, criação, edição e exclusão ficam sem proteção de rota;
- controles administrativos aparecem para qualquer visitante em `src/app/products/products.component.html:1-21` e `src/app/product/product.component.html:16-19`;
- `User` não possui papel/permissão administrativa (`src/app/interfaces/user.interface.ts:3-20`).

**Impacto:** no front-end, não existe distinção confiável entre visitante, cliente e administrador. Se o back-end também não validar cada operação, há risco de alteração/exclusão indevida de dados.

**Correção sugerida:** definir sessão e papéis; criar guards de autenticação e administração; ocultar controles por permissão; e, principalmente, exigir autorização no back-end em cada endpoint sensível.

**Aceite:** rotas e ações administrativas falham para usuários sem papel adequado, inclusive quando a API é chamada diretamente.

### B-04 — Pagamento está incompleto e a venda é concluída cedo demais

**Evidência:**

- `src/app/cart/cart.component.ts:64-83` cria a venda com `sold: true` antes de qualquer confirmação;
- `src/app/cart/payments/payments.component.ts:43-58` apenas registra cartão e boleto no console;
- o Pix envia valor e CPF construídos no cliente (`payments.component.ts:61-68`) e interpreta campos legados por meio de `any` (`payments.component.ts:72-77`);
- o endpoint ainda é `/payments/pix` (`src/app/services/cart/crud-cart/crud-cart.service.ts:129-136`), sem evidência do fluxo decidido para PagBank;
- não há, neste repositório, tratamento de webhook, status pendente/pago/falhou, idempotência ou reconciliação.

**Impacto:** pedidos podem ser marcados como vendidos sem pagamento, e valores/identidade vindos do navegador não podem ser considerados confiáveis.

**Correção sugerida:** implementar o PagBank no back-end; recalcular preço/frete no servidor; criar pedido pendente; confirmar somente por webhook validado; usar chave de idempotência; não expor credenciais no front-end.

**Aceite:** uma matriz de testes comprova sucesso, falha, expiração, duplicidade de webhook, reenvio e divergência de valor.

### B-05 — O carrinho perde dados e não remove produtos corretamente

**Evidência:**

- `addToCart` usa apenas o array em memória e não restaura o carrinho existente antes de salvar (`crud-cart.service.ts:32-46`), podendo sobrescrever itens após recarregar a página;
- `removeProductFromCart` está inteiramente comentado e retorna o array sem alteração (`crud-cart.service.ts:49-60`);
- a remoção no componente também está comentada (`src/app/cart/cart.component.ts:52-54`);
- a deduplicação não retorna a condição dentro do `filter`, produzindo array vazio quando mistura carrinho remoto e local (`crud-cart.service.ts:67-72`);
- `savingCart` está vazio (`cart.component.ts:62`);
- o perfil do carrinho é lido de `profile` (`crud-cart.service.ts:82-89`), mas o login grava `session` (`src/app/guards/auth.service.ts:54-68`).

**Impacto:** o usuário pode perder itens, não conseguir removê-los, receber total incorreto ou finalizar uma compra com perfil vazio.

**Correção sugerida:** criar uma única fonte de verdade reativa para o carrinho, restaurá-la na inicialização, implementar add/remove/clear com testes e padronizar a sessão.

**Aceite:** testes cobrem visitante e usuário logado, reload, duplicação, remoção, limpeza, merge e persistência.

## Achados de prioridade alta

### A-01 — O valor usado como token é, na prática, o perfil serializado

`AuthService.authUser` remove o token e grava o perfil em `session` (`src/app/guards/auth.service.ts:59-68`). Os serviços de produto, carrinho e pagamento leem toda essa string e a enviam como Bearer/token (`src/app/services/products/crud-products/crud-products.service.ts:26-32`, `src/app/services/cart/crud-cart/crud-cart.service.ts:24-29` e `src/app/services/payments/crud-payments/crud-payments.service.ts:22-28`). Nos serviços de produto e pagamento, o header ainda é construído uma única vez na criação da instância (`crud-products.service.ts:13` e `crud-payments.service.ts:15`), podendo ficar obsoleto.

**Ação:** usar cookie `HttpOnly` seguro ou token de acesso em memória com interceptor; padronizar uma única chave/estratégia; nunca enviar o JSON do perfil como credencial.

### A-02 — Logout pode deixar sessão local ativa

`checkSession` chama `logout()` sem `await` no `catch` (`src/app/guards/auth.service.ts:20-31`). O `logout` só limpa memória e `localStorage` depois que o POST ao servidor tem sucesso (`auth.service.ts:74-79`). Se a API estiver indisponível, a sessão local pode permanecer.

**Ação:** limpeza local deve ocorrer em `finally`; a chamada remota pode ser melhor esforço. Componentes também devem aguardar/tratar a Promise.

### A-03 — URL direta de produto depende de estado no `localStorage`

A rota declara `product/:product_id` (`src/app.routes.ts:35-36`), porém o componente não usa o parâmetro: lê `selectedProduct` do navegador (`src/app/services/products/crud-products/crud-products.service.ts:42-56`) e o remove ao sair (`crud-products.service.ts:59-63`). Abrir um link compartilhado ou atualizar a página pode resultar em produto vazio.

**Ação:** buscar o produto pelo `product_id`; usar estado local apenas como cache opcional.

### A-04 — A página de produto desaparece no breakpoint mobile

O único markup do template é `<section id="desktop">` (`src/app/product/product.component.html:1-105`). O Sass esconde `#desktop` no mobile (`src/app/product/product.component.sass:9-13`) e tenta exibir `#mobile` (`product.component.sass:262-267`), mas não existe elemento `#mobile` no template.

**Ação:** criar uma composição responsiva única ou implementar e testar a versão mobile. Validar pelo menos 320, 375, 768, 1024 e 1440 px.

### A-05 — Dependências de produção possuem 19 avisos conhecidos

O `pnpm audit --prod` encontrou:

- 12 avisos altos em pacotes Angular (`@angular/common`, `@angular/compiler`, `@angular/core` e `@angular/service-worker`);
- 6 moderados nesses mesmos pacotes;
- 1 baixo no Quill, relacionado a XSS na exportação HTML.

As correções indicadas pela auditoria estão em versões Angular 20.3.17 a 20.3.27, dependendo do aviso. O projeto declara Angular 20.0.x (`package.json:13-22`). `@swimlane/ngx-charts` também está em versão alpha (`package.json:23`).

**Ação:** atualizar o conjunto Angular de forma coordenada para uma versão 20.3.x corrigida ou superior compatível; regenerar lockfiles conscientemente; revisar o risco do Quill e a necessidade da dependência alpha; repetir build, testes e audit.

### A-06 — Não há configuração real de ambiente de produção

O único arquivo declara `production: false` e API em `http://localhost:3333` (`src/environments/environment.ts:1-4`). `angular.json:42-67` não possui `fileReplacements` para produção.

**Ação:** definir configuração de desenvolvimento/homologação/produção sem segredos no bundle; documentar URL pública, CORS e cookies seguros.

### A-07 — O PWA está configurado para arquivos que o build não copia

`angular.json:29-32` copia apenas favicon e `src/assets`, enquanto manifest e ícones estão em `public/`. O `ngsw-config.json:10-15` espera `/manifest.webmanifest`, mas `src/index.html:3-10` não contém `<link rel="manifest">`. Com o builder atual (`angular.json:19`), a pasta `public` não está configurada como asset.

**Ação:** incluir `public` nos assets ou migrar de forma validada para o application builder; adicionar manifest e `theme-color` ao HTML; verificar os arquivos no `dist` e testar instalação/offline.

### A-08 — Erros HTTP podem ser tratados como sucesso

`clearCart`, `generatePix` e `updateProduct` capturam o erro e o enviam a um `handleResponse` que aceita qualquer objeto verdadeiro (`src/app/services/cart/crud-cart/crud-cart.service.ts:116-150` e `src/app/services/products/crud-products/crud-products.service.ts:72-94`).

**Impacto:** a interface pode informar sucesso após falha do servidor e seguir com estado inconsistente.

**Ação:** não transformar exceções em respostas; tipar um envelope de API real e propagar falhas para tratamento centralizado.

### A-09 — Cálculo de frete tem rota e seleção frágeis

`MelhorEnvioService` monta a URL com `/:<CEP>` (`src/app/services/melhor-envio/melhor-envio.service.ts:17-21`), mantém resultados entre chamadas e usa `pop/push` enquanto percorre preços (`melhor-envio.service.ts:24-42`). No componente, o resultado escolhido vai para `sale.shipping`, mas a lista renderizada `shippings` nunca é preenchida (`src/app/product/product.component.ts:40,111-132`; template em `product.component.html:47-60`).

**Ação:** confirmar o contrato de rota no back-end, limpar/normalizar cotações por consulta, selecionar o menor serviço de forma pura e exibir erro/prazo/preço de maneira determinística.

## Achados de prioridade média

### M-01 — Quantidade, estoque, frete e total não fecham o mesmo modelo

`productsQuantity` muda apenas na tela de produto (`src/app/product/product.component.ts:139-146`). O carrinho soma uma unidade de cada produto (`src/app/cart/cart.component.ts:40-49`) e a venda usa o tamanho do array (`cart.component.ts:76-78`). Não há revalidação de estoque ou total no servidor demonstrável neste repositório.

**Ação:** adotar item de carrinho `{ productId, quantity, unitPriceSnapshot? }`; o servidor deve validar estoque e recalcular produto, desconto, frete e total.

### M-02 — Áreas importantes ainda são mocks ou placeholders

- newsletter: a rota permanece vazia após a remoção do carrossel placeholder; a integração com o service ainda não foi implementada;
- sobre: usa `ABOUT_MOCK` em vez do serviço (`src/app/about/about.component.ts:5-25`);
- dashboard: vendas e produto mais vendido fixos (`src/app/dashboard/dashboard.component.ts:11-15`);
- perfil: `openCart()` vazio (`src/app/profile/profile.component.ts:56`).

**Ação:** definir o que entra no MVP, terminar o que faz parte dele e remover/ocultar o restante para não parecer funcional sem ser.

### M-03 — HTML rico precisa de política explícita de sanitização

A descrição do produto é renderizada com `[innerHTML]` (`src/app/product/product.component.html:22-24`) e vem de conteúdo editável por Quill. O Angular sanitiza HTML por padrão, o que reduz o risco, mas o audit também aponta aviso no Quill e não há contrato explícito de tags/atributos aceitos no back-end.

**Ação:** sanitizar no servidor com allowlist, manter a sanitização Angular, evitar `bypassSecurityTrustHtml` e testar cargas maliciosas.

### M-04 — Templates usam Bootstrap e Bootstrap Icons sem dependências configuradas

Há classes `row`, `col-*`, `mx-*`, `my-*` e ícones `bi bi-*` em vários templates, por exemplo `src/app/product/product.component.html:22-58` e `src/app/products/products.component.html:13-20`. Não há Bootstrap/Bootstrap Icons em `package.json:12-44`, em `angular.json:33-38` nem link correspondente no `index.html`.

**Impacto:** grid, espaçamentos e ícones podem não aparecer como esperado.

**Ação:** instalar/configurar conscientemente ou substituir por layout próprio/Angular Material.

### M-05 — Acessibilidade das interações é insuficiente

Várias ações usam `div`, `span`, `mat-icon` ou cards com `(click)` sem semântica de botão/link, teclado ou foco; imagens têm `alt="..."`, `alt="#"` ou vazio sem critério (`src/app/products/products.component.html:11-28`, `src/app/product/product.component.html:5-18,39-43,65-103`). Há uso frequente de `alert` e `console` em vez de mensagens acessíveis.

**Ação:** usar `button`/`a`, nomes acessíveis, foco visível, mensagens com `aria-live`, textos alternativos reais e teste de teclado/leitor de tela.

### M-06 — Há assinatura reativa sem descarte e lógica dependente do último item

Cada chamada de `checkIfProductIsInCart` cria uma nova inscrição sem cancelamento (`src/app/product/product.component.ts:168-173`). O `forEach` redefine o booleano para cada produto, então o último item pode sobrescrever uma correspondência anterior (`product.component.ts:175-182`).

**Ação:** derivar o estado com `some`, `takeUntilDestroyed`/signal/async pipe e inicializar o subject com o carrinho persistido.

### M-07 — Formulários e contratos permitem dados inválidos

Criação/edição de produto montam forms sem `Validators` e só adicionam valores truthy ao `FormData`; preço ou estoque zero são omitidos (`src/app/products/create-product/create-product.component.ts:69-85,111-133` e equivalente de update). Endereço modela `houseNumber` como número, excluindo `s/n` e complementos (`src/app/interfaces/user.interface.ts:17`), e `Address.erro` é string enquanto o código compara com `'true'` (`src/app/header/login/register/register.component.ts:114`; `src/app/interfaces/address.interface.ts:12`).

**Ação:** validar tipos, faixas e obrigatoriedade; alinhar DTOs com os contratos reais da API e do ViaCEP.

### M-08 — Dados pessoais e logs precisam de revisão de privacidade

Perfil, CPF, endereço, carrinho e frete podem permanecer em `localStorage`, acessível a qualquer script executado na origem. Componentes também registram dados de carrinho, pagamento e perfil no console, por exemplo `src/app/cart/payments/payments.component.ts:39-40,69-70`.

**Ação:** minimizar persistência, não guardar credenciais/dados desnecessários no navegador, remover logs de produção e documentar retenção/consentimento conforme LGPD.

### M-09 — Não há lint, cobertura mínima ou CI visível

`package.json:5-10` possui apenas start/build/watch/test. Existem somente duas specs, e ambas não compilam. Não há regra de lint nem workflow de CI no repositório.

**Ação:** adicionar lint/format/check, testes unitários e de jornadas críticas, e CI que bloqueie PR quando typecheck, test, build ou audit definido pela equipe falhar.

## Achados de prioridade baixa

### L-01 — Builder e schematics estão desalinhados com a arquitetura atual

O projeto usa componentes standalone, mas o schematic padrão declara `standalone: false` (`angular.json:8-12`) e o builder continua como `@angular-devkit/build-angular:browser` (`angular.json:18-20`).

**Ação:** alinhar o schematic e avaliar migração do builder em uma tarefa separada, com comparação de output e PWA.

### L-02 — Abstrações e tipos geram casts que escondem erros

Os serviços usam conversões como `as unknown as T`, envelopes incompletos e classes CRUD abstratas com responsabilidades diferentes. O erro `response.data` dos testes é um sintoma desse desenho.

**Ação:** definir DTOs por endpoint, eliminar casts duplos e preferir serviços concretos simples onde a generalização não reduz duplicação real.

### L-03 — Consistência textual e acabamento

Há textos provisórios, nomes inconsistentes e vários `console.log`/`alert`. Também convém revisar ortografia, mensagens de erro, `alt`, nomes como `buildedSale` e consistência de idioma antes da entrega.

## Pontos positivos preserváveis

- Angular standalone e rotas lazy já reduzem acoplamento inicial.
- TypeScript está em modo estrito e o grafo principal passa no typecheck isolado.
- Há separação inicial por domínio e interfaces para produto, venda, frete e usuário.
- A intenção de PWA, catálogo, carrinho, Melhor Envio e administração já está representada na estrutura.
- O documento `AGENTS.md` agora centraliza decisões, arquitetura, integrações e convenções para a continuidade do projeto.

## Ordem recomendada de correção

### Etapa 0 — Alinhar decisões com Daniel

1. Obter e revisar o repositório/contrato do back-end.
2. Confirmar sessão: cookie `HttpOnly` ou access token; papéis cliente/admin.
3. Fechar o contrato PagBank, webhook, status do pedido e idempotência.
4. Fechar o contrato Cloudinary, incluindo `public_id`/identificador para exclusão.
5. Definir MVP: quais telas precisam estar funcionais na primeira entrega.

### Etapa 1 — Criar uma base verificável

1. Corrigir os erros TypeScript dos testes.
2. Corrigir ou justificar budgets e fazer o build passar.
3. Atualizar Angular/dependências e repetir o audit.
4. Adicionar lint e CI.

### Etapa 2 — Segurança e identidade

1. Padronizar sessão e interceptor/cookies.
2. Corrigir logout e refresh.
3. Implementar guards de autenticação/admin.
4. Confirmar autorização no back-end.
5. Reduzir dados pessoais em storage/logs.

### Etapa 3 — Jornada comercial

1. Buscar produto pelo ID da rota.
2. Refazer o modelo e persistência do carrinho.
3. Corrigir quantidade, estoque, frete e cálculo server-side.
4. Implementar checkout PagBank com estados e webhook.
5. Validar Cloudinary no ciclo criar/editar/excluir produto.

### Etapa 4 — Experiência e publicação

1. Corrigir mobile e acessibilidade.
2. Concluir ou retirar mocks/placeholders.
3. Corrigir PWA e ambientes.
4. Executar testes E2E das jornadas críticas.

## Checklist de aceite para o Daniel

- [ ] `npm run build` passa em produção.
- [ ] `npm test -- --watch=false --browsers=ChromeHeadless` passa.
- [ ] typecheck, lint e testes rodam no CI do PR.
- [ ] audit não possui avisos altos sem aceite formal/documentado.
- [ ] visitante, cliente e admin têm permissões verificadas no front-end e API.
- [ ] abrir/atualizar `/product/:id` funciona sem estado anterior.
- [ ] carrinho sobrevive a reload e adiciona/remove/limpa sem perder itens.
- [ ] estoque, preço, quantidade e frete são recalculados no servidor.
- [ ] PagBank confirma pedido somente após webhook válido e idempotente.
- [ ] produto funciona em mobile e por teclado.
- [ ] manifest, ícones, service worker e configuração de produção existem no `dist`.
- [ ] mocks, logs sensíveis e ações vazias foram removidos ou explicitamente excluídos do MVP.

## Perguntas que precisam de resposta do Daniel

1. Onde está o back-end correspondente e qual é o contrato atual dos endpoints?
2. Quais rotas e operações são exclusivas de administrador?
3. O login usa cookie de refresh + access token, ou somente cookie de sessão?
4. Qual ambiente PagBank será usado e quais eventos de webhook confirmam o pedido?
5. Qual é a política para carrinho de visitante ao entrar na conta?
6. Quais campos do Cloudinary são persistidos e como ocorre a remoção/substituição da imagem?
7. Newsletter, dashboard, avaliações e página Sobre fazem parte do MVP?
8. Qual será a URL da API em homologação e produção?

## Recomendação final

Não começar pelo acabamento visual isolado. Primeiro tornar build/testes confiáveis, fechar autenticação e contratos do back-end e corrigir a jornada produto → carrinho → frete → pedido → pagamento. Depois disso, mobile, PWA, acessibilidade e conteúdo poderão ser validados sobre uma base estável.
