# Luz Violeta Macramê - referência geral do projeto

> Documento canônico para humanos e agentes. Última curadoria: 16/08/2026.
> Leia primeiro as seções ligadas à tarefa; consulte o restante apenas quando necessário.

## 1. Propósito e estado do projeto

A Luz Violeta Macramê é a marca da artesã Camila Ribeiro Pedroso, de Itu/SP. A marca une macramê, iluminação, decoração, pedras naturais e uma comunicação ligada a acolhimento, intenção, natureza e espiritualidade.

O repositório contém o **front-end** de uma loja virtual e PWA. O objetivo atual inclui catálogo, conta de usuário, carrinho, frete, pagamento e telas administrativas. Há uma hipótese de evolução para uma plataforma única de exposição, venda e gestão do negócio - finanças, encomendas, produção, produtos, insumos e estoque -, mas essa ampliação ainda depende de decisão de produto. Não trate a hipótese como requisito aprovado.

### Pessoas e responsabilidades

| Pessoa | Papel | Referência para decisões |
| --- | --- | --- |
| Camila Ribeiro Pedroso | Proprietária da marca e artesã | Operação, catálogo, linguagem da marca, produção e necessidades comerciais |
| Daniel de Souza Cordeiro | Dono e desenvolvedor principal do projeto | Arquitetura, revisão técnica e autorização de merge para `main` |
| Fábio | Colaborador | Desenvolvimentos isolados em branches, documentação e propostas para revisão |

Em dúvida de negócio, não invente: registre a questão para Camila e Daniel. Em dúvida arquitetural que altere contratos ou padrões existentes, preserve o comportamento e peça revisão de Daniel.

## 2. Fontes de verdade e segurança

Use esta ordem de precedência:

1. Pedido explícito e decisão humana mais recente.
2. `package.json`, lockfiles e configuração efetivamente versionada.
3. Código em execução e contratos verificados da API.
4. Este documento.
5. PDF histórico e materiais externos.

Referências principais:

- Repositório oficial: <https://github.com/DenielCordeiro/luz_violeta_macrame>
- Notion operacional: <https://app.notion.com/p/Luz-Violeta-Macram-1f54b2346ca9807fbe83f1298f206f6c>
- Trello de comunicação entre Daniel e Camila: <https://trello.com/b/f6dno9rY/luz-violeta-agosto> (quadro autenticado; estado consultado em 16/08/2026).
- Fluxo de caixa: <https://docs.google.com/spreadsheets/d/1-OIUMU7cbvCxyBAe-0XkKXENX8XUK7wDuBmQxDhUurk/edit?usp=sharing>
- Manual de marca: `.local/references/manual-da-marca-luz-violeta-macrame.pdf` (Agência Transcender, 2024; referência visual oficial, mantida somente na máquina).
- Documento técnico histórico: `.local/references/documentacao-tecnica-historica-luz-violeta-macrame.pdf` (original de 12/02/2026; mantido somente na máquina, fora do Git por decisão de Daniel).
- Revisão técnica vigente: `docs/revisao-geral-2026-08-13.md` (build, testes, segurança, jornadas críticas e ordem de correção).

Referências privadas da máquina ficam em `.local/references/`, caminho protegido pelo `.gitignore` versionado. Não remova essa regra nem use `git add -f` nesses arquivos. O diretório não é criado pelo clone: copie os PDFs localmente quando precisar consultá-los.

O Notion contém uma página de senhas e logins. **Nunca copie credenciais, tokens, CPF, dados de clientes ou segredos para o repositório, logs, issues, prompts ou documentação.** Consulte somente o mínimo necessário e mantenha segredos no back-end por variáveis de ambiente ou gerenciador apropriado.

### Decisões vigentes incorporadas à documentação

- Banco de dados: MongoDB permanece como persistência de dados.
- Imagens: Firebase Storage foi descartado; a decisão vigente é **Cloudinary**.
- Pagamentos: EFI Bank foi descartado; a decisão vigente é **PagBank**.
- A arquitetura detalhada do back-end não está neste repositório. Models, controllers, middlewares, Mongoose, Yup, JWT e bcrypt são descrições históricas a confirmar no repositório da API antes de qualquer alteração.

## 3. Regra de início de qualquer tarefa

1. Leia `package.json` e o lockfile correspondente antes de trabalhar com linguagem, framework, biblioteca ou API.
2. Leia as seções relevantes deste arquivo e confirme se o código atual corresponde ao que está documentado.
3. Verifique `git status --short --branch`; preserve alterações e arquivos do usuário.
4. Leia `.local/HANDOFF.md`, quando existir, e confirme seu conteúdo contra o Git antes de agir.
5. Para informação dependente de versão, consulte a documentação oficial da versão instalada ou da API atual.
6. Se a pesquisa mudar uma regra durável, atualize a seção 12, com data e fonte. Se não houver diferença, registre apenas a verificação.
7. Implemente a menor mudança coerente; não misture correções não solicitadas.
8. Valide em proporção ao risco e informe comandos, resultados e lacunas.

Não atualize dependências automaticamente. Quando uma nova dependência for indispensável, justifique, prefira a opção leve e compatível e confirme o impacto no bundle e no lockfile.

## 4. Git e colaboração

- Nunca desenvolva diretamente em `main`.
- Cada trabalho deve ter branch própria e encapsular um contexto reconhecível, como uma página, funcionalidade, refinamento visual ou conjunto coerente de correções. Não crie uma branch por seção pequena da mesma tela nem misture contextos independentes.
- Use nomes curtos, simples, em minúsculas e fáceis de relacionar ao trabalho, preferencialmente uma a três palavras separadas por hífen e sem prefixos técnicos desnecessários. Exemplos: `home`, `pagamentos`, `limpeza-components` e `correcao-carrinho`.
- Crie a branch a partir de `origin/main` atualizado, salvo quando a tarefa continuar explicitamente uma branch existente.
- Daniel revisa a branch e decide ajustes ou merge em `main`.
- Dentro da mesma branch, faça commits pequenos e semanticamente coesos por etapa revisável e validável. Exemplos de divisões úteis são estrutura/template, comportamento do componente ou service, estilos, testes e documentação; faça um commit assim que a etapa estiver consistente e sua validação pertinente passar.
- Não imponha um commit por arquivo: mantenha no mesmo commit arquivos inseparáveis para o comportamento daquela etapa e separe alterações que Daniel possa entender, testar ou reverter de forma independente. Evite commits intermediários deliberadamente quebrados e não misture formatação ou refatorações alheias ao objetivo do commit.
- Não force push, não reescreva histórico compartilhado e não descarte alterações alheias.
- Commits do histórico usam predominantemente `feat[Área]:`, `fix[Área]:`, `refactor[Área]:`, `style[Área]:`, `test[Área]:` e `docs[Área]:`. Preserve esse padrão quando ele não conflitar com a convenção definida para a branch. Após o prefixo, use um assunto curto, preferencialmente uma única palavra que identifique a etapa e dê a Daniel uma noção clara do conteúdo, como `feat[Home]: estrutura`, `feat[Home]: conteúdo`, `style[Home]: responsividade` ou `test[Home]: estados`. Quando uma palavra não for suficiente, use a menor expressão explicativa possível.
- Antes da entrega: informe branch, arquivos alterados, validações executadas e pendências reais.

Branches remotas observadas em 16/08/2026: `main`, `fix`, `home`, `payments`, `product` e `docs/project-reference`. `main` apontava para `e92d6ec`.

### Protocolo de handoff entre agentes

O Git e o código continuam sendo a fonte de verdade. `.local/HANDOFF.md` é um resumo operacional desta máquina para continuidade entre conversas; ele é ignorado pelo Git e nunca substitui a conferência do repositório.

Ao iniciar uma tarefa, todo agente deve:

1. ler `.local/HANDOFF.md`, se existir;
2. conferir branch, `git status`, histórico recente e PR relacionado;
3. validar se as pendências registradas continuam atuais antes de retomá-las;
4. consultar `.local/ROADMAP.md` quando a tarefa envolver planejamento ou escolha da próxima etapa.

Ao concluir, pausar ou transferir uma tarefa, o agente deve atualizar `.local/HANDOFF.md` com data e hora, branch, objetivo, estado atual, arquivos relevantes, validações executadas, pendências, próximo passo e situação de commit/push/PR. Atualize `.local/ROADMAP.md` quando a situação de planejamento mudar. Nunca registre credenciais, tokens, dados pessoais ou outros segredos nesses arquivos.

Se os arquivos locais não existirem, crie-os. Como `GEMINI.md` importa este documento, o protocolo vale igualmente para Codex e Gemini CLI.

## 5. Ambiente e comandos

### Versões instaladas no projeto

| Camada | Versão/configuração |
| --- | --- |
| Angular | `20.0.x` (`@angular/core` 20.0.6; CLI 20.0.5) |
| TypeScript | `5.8.3`, `strict: true` |
| RxJS | `7.8.2` |
| Angular Material/CDK | `20.0.x` |
| Sass | sintaxe indentada `.sass` |
| Quill / ngx-quill | `2.0.3` / `28.0.0` |
| ngx-webstorage | `19.0.1` |
| ngx-charts | `23.0.0-alpha.0` - dependência pré-release |
| Gerenciador | `pnpm 10.30.3` |

Comandos:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm start
corepack pnpm build
corepack pnpm test
corepack pnpm exec tsc --noEmit -p tsconfig.app.json
```

Em algumas sessões Windows, Node e Git existem mas não estão no `PATH`. Corrija o ambiente antes de diagnosticar o projeto:

```powershell
$env:PATH = 'C:\Program Files\nodejs;C:\Program Files\Git\cmd;' + $env:PATH
```

Não grave caminhos pessoais no código. O projeto possui `package-lock.json` e `pnpm-lock.yaml`, mas `packageManager` e `pnpm-workspace.yaml` definem **pnpm** como referência; não gere alterações no lockfile npm.

### Baseline verificado em 13/08/2026

- `pnpm exec tsc --noEmit -p tsconfig.app.json`: passou.
- `pnpm build`: compilou os bundles, mas falhou no budget de estilo de `product.component.sass` (5,13 kB; limite de erro 4 kB).
- `npm run build`: reproduziu o mesmo resultado; a falha é do budget Angular, não do gerenciador de pacotes.
- Avisos adicionais de budget: `cart.component.sass` e `carousel.component.sass`.
- Aviso CommonJS: `quill-delta` via Quill.
- Não há script de lint.
- Os testes existentes são apenas esqueletos de criação para dois services; cobertura funcional não está estabelecida.

### Atualização verificada em 24/08/2026

- `pnpm exec tsc --noEmit -p tsconfig.app.json`: passou.
- `pnpm build`: passou sem alteração dos budgets; `product.component.sass` caiu para 3,82 kB e permanece com aviso acima de 2 kB, mas abaixo do limite de erro de 4 kB.
- `cart.component.sass` e `delete-product.component.sass` ficaram abaixo do limite de aviso; o carrossel placeholder e seus estilos sem uso foram removidos.
- O teste automatizado continua bloqueado por erros anteriores nos specs genéricos de products/payments e no contrato `BaseAPI<T>`.
- Permanecem os avisos do bundle inicial e de CommonJS (`quill-delta`), fora do escopo da redução Sass.

Não declare a base saudável apenas porque o typecheck passou. O `tsconfig.app.json` parte de `src/main.ts`, portanto arquivos não alcançados pelo grafo podem ficar fora da verificação.

## 6. Arquitetura do front-end

Aplicação Angular standalone inicializada em `src/main.ts`:

```text
AppComponent
├── HeaderComponent -> MenuComponent -> DesktopMenuComponent -> LoginComponent
├── RouterOutlet -> páginas carregadas por lazy loading
└── FooterComponent

Componente -> service concreto -> classe CRUD abstrata -> HttpClient -> API :3333
```

Providers globais: HTTP, router, `ngx-webstorage`, service worker e configuração do Quill. Locale `pt-BR` é registrado. A API de desenvolvimento está fixada em `http://localhost:3333`; ViaCEP em `https://viacep.com.br/ws`.

### Rotas

| Rota | Componente | Estado observado |
| --- | --- | --- |
| `/` | redireciona para `/newsletter` | ativo |
| `/newsletter` | vitrine futura | rota vazia após remoção do carrossel placeholder |
| `/products` | catálogo e CRUD | integração principal existente |
| `/product/:product_id` | detalhe, frete e carrinho | usa produto selecionado no localStorage |
| `/cart` | carrinho e checkout | fluxo parcial |
| `/register` | cadastro e ViaCEP | formulário reativo |
| `/profile` | perfil | atualização/exclusão parciais |
| `/about` | marca e Camila | usa mock local |
| `/dashboard` | indicadores | usa valores mockados |

`authGuard` é importado mas não aplicado. Sua implementação atual sempre redireciona e retorna `false`; não a reutilize sem corrigir e testar autorização.

### Organização do código

- `src/app/interfaces`: contratos de domínio (`Product`, `User`, `Sale`, `Shipping`, `News`, `Review`, `About`).
- `src/app/services`: acesso HTTP e estado compartilhado por domínio.
- `src/app/<feature>`: componentes, templates e Sass próximos à funcionalidade.
- `src/assets/sass`: tokens de cor e mixins responsivos.
- `src/environments`: URLs de desenvolvimento.
- `public`: manifesto e ícones PWA.

### Padrão de services definido por Daniel

Para um novo domínio com CRUD, preserve o padrão orientado a objetos:

1. Uma classe abstrata `Crud<Domain>Service<T extends BaseCrud>` concentra URL, HTTP e operações comuns.
2. Um service concreto `@Injectable({ providedIn: 'root' })` estende a classe abstrata e informa a rota.
3. Componentes dependem do service concreto, não da classe base.
4. Tipos de request e response devem ser explícitos; não perpetue casts `as unknown as T` quando o contrato puder ser corrigido.
5. Inicialize headers no momento da requisição, não na construção do singleton, para evitar token obsoleto.

Use herança quando houver comportamento realmente comum. Para estado de UI ou integração isolada, uma classe concreta simples continua adequada. Priorize encapsulamento, responsabilidade única e contratos pequenos.

### Fluxos e endpoints inferidos do front-end

| Domínio | Rotas HTTP observadas |
| --- | --- |
| Sessão | `POST /session/`, `/session/refresh`, `/session/logout` |
| Perfil | `POST /profile`, `PUT /profile/update`, `DELETE /profile/:id` |
| Produtos | `GET/POST /products`, `PUT/DELETE /products/:id` |
| Newsletter | `GET/POST /newsletter`, `PUT/DELETE /newsletter/:id` |
| Sobre | `GET /about`, `PUT /about` |
| Avaliações | CRUD em `/footer/reviews` |
| Carrinho | `PUT /save_cart/:user_id`, `/clear_cart/:id` |
| Frete | `POST /melhor-envio/:postalCode` |
| Pagamento legado | `/payments/*` e `/payments/pix` - contrato a substituir por PagBank |

Estes endpoints são inferências do cliente, não prova do contrato do back-end. Verifique a API antes de mudar nomes, payloads ou autenticação.

## 7. Estado funcional e riscos conhecidos

Trate esta lista como diagnóstico, não como autorização para corrigir tudo:

### Planejamento no Trello - fotografia de 25/08/2026

O Trello registra `Product` como concluído (7/7). Permanecem `Home Page` em Features (0/5), `Filter Products` em desenvolvimento, `Cart` em correção (0/1), `Menu` aguardando correção (0/3) e `Payments API, "PAGBANK"` pausado (0/5). `Dashboard` (0/9) e `Google Analytics` (0/2) continuam em Ideas. Há um cartão anterior de carrinho concluído (4/4); o cartão atual é outro escopo, relacionado ao redirecionamento ao clicar no card.

O roadmap operacional detalhado fica em `.local/ROADMAP.md`, somente nesta máquina.

O quadro é fonte de planejamento e comunicação, não prova de implementação. Confirme no código e na API antes de considerar um item concluído.

### Segurança e autenticação

- Chaves locais `session`, `profile` e `user_id` são usadas de forma inconsistente.
- Alguns headers enviam o JSON completo do localStorage como Bearer; outros usam o nome `token` em vez de `Authorization`.
- Ações administrativas de produto aparecem sem autorização comprovada.
- `withCredentials` é usado apenas em refresh/logout; a estratégia cookie + access token precisa ser unificada com o back-end.
- Nunca processe segredo do Cloudinary ou token privado do PagBank no Angular.

### Carrinho e checkout

- A remoção de item está comentada.
- A deduplicação em `getProductsInCart()` tem callback sem `return`, podendo esvaziar a lista.
- Perfil é lido de `profile`, enquanto login grava `session`.
- `goToCart()` navega para `/cart/:id`, rota que não existe.
- Quantidade alterada no detalhe não é incorporada ao item ou ao total.
- Frete exibido no carrinho está fixado em zero.

### Conteúdo incompleto

- Newsletter permanece vazia e ainda não chama o service; o carrossel placeholder foi removido.
- About e dashboard usam mocks.
- Footer usa avaliação de teste e não chama `searchForReviews()`.
- `openCart()` no perfil e `savingCart()` estão vazios.
- Templates usam Angular Material para controles e ícones, com Grid, Flexbox, espaçamento e responsividade implementados no Sass local.

### Contratos e manutenção

- Interfaces têm muitos campos opcionais, ocultando estados inválidos.
- `BaseAPI<T>` não descreve payloads reais; vários services contornam isso com casts.
- Há `any`, `Object[]`, `String` e assinaturas genéricas demais.
- Subscriptions não são sempre encerradas.
- `ngx-charts` está em alpha; valide compatibilidade antes de ampliar o dashboard.
- O build de produção passa; `product.component.sass` ainda gera aviso de budget, abaixo do limite de erro.

Ao trabalhar em uma dessas áreas, escreva teste de regressão ou validação reproduzível para o comportamento alterado.

## 8. Integrações vigentes

### MongoDB

É a persistência de dados do back-end. O Angular não deve se conectar diretamente. Confirme schemas, índices, validações e versionamento no repositório da API. Para produção, preserve retry/error handling e não registre documentos com dados pessoais.

### Cloudinary - imagens

Substitui o Firebase Storage. Preferência de segurança: upload autenticado pelo back-end ou upload direto assinado, cuja assinatura é gerada no servidor. O front-end envia arquivo/metadados e recebe URL pública, `public_id`/`asset_id` e metadados necessários. Exclusão deve usar o identificador do ativo no back-end, não apenas a URL.

Fonte: [Cloudinary Node.js SDK e upload](https://cloudinary.com/documentation/node_image_and_video_upload).

### PagBank - pagamentos

Substitui EFI Bank. Use a API de Pedidos do PagBank no back-end. Fluxo mínimo:

1. Criar pedido com `reference_id`, cliente, itens, entrega e meio de pagamento.
2. Enviar `Authorization: Bearer <token>` e chave de idempotência quando aplicável.
3. Para PIX, criar pedido com `qr_codes`; consumir texto/imagem retornados.
4. Receber notificações no back-end, validar estado do pedido e só então marcar venda como paga.
5. Testar em Sandbox e concluir homologação antes de produção.

Valores da API são normalmente em centavos; valide arredondamento e nunca confie no total calculado pelo navegador. Fontes: [primeiros passos](https://developer.pagbank.com.br/docs/primeiros-passos), [criar pedido](https://developer.pagbank.com.br/reference/criar-pedido) e [PIX](https://developer.pagbank.com.br/reference/criar-pedido-pedido-com-qr-code).

### Melhor Envio

A cotação requer CEP de origem, CEP de destino e produtos ou volumes. Dimensões estão em centímetros, peso em quilogramas e valores em reais. Se o frete for comprado via API, salve no checkout os dados da cotação usados na compra. Não selecione silenciosamente apenas o menor preço: prazo, serviço, customizações e decisão do usuário também importam.

Fonte: [cotação de fretes](https://docs.melhorenvio.com.br/docs/cotacao-de-fretes).

### ViaCEP

Usado no cadastro e atualização de endereço. Mantenha validação local de oito dígitos, trate `erro`, timeouts e falhas sem apagar campos já preenchidos.

## 9. Operação do negócio observada

O Notion está dividido em duas áreas principais:

- **Ateliê:** finanças, encomendas, produção, ensaios, planejamento de peças, estoque de insumos, fornecedores, embalagens, produtos do site, feiras e arquivo de peças.
- **Marketing:** planejamento de marca e conteúdo, cronograma editorial, hábitos, estudos, metas, narrativas, lançamentos e análise de Stories/Reels.

Estruturas úteis para futuros requisitos:

- Encomendas: cliente, pagamento, status, prazo, frete, valor, resumo e preço.
- Estoque: material, status e quantidade; estados observados incluem “Em estoque” e “Zerado”.
- Financeiro no Notion: páginas de vendas e despesas separadas por mês.
- Fluxo de caixa no Sheets: mês, data, descrição, categoria, entrada, saída, pagamento e saldo.
- Embalagens: tamanhos P/M/G, dimensões, peso do produto, peso adicional e embalagem associada.
- Produtos: produção sob encomenda, prazo geral de até sete dias úteis, variações de kit e fichas com título, narrativa e informações técnicas.

Não replique essas bases automaticamente no site. Primeiro defina fonte de verdade, responsáveis, permissões, migração, histórico, conciliação financeira e funcionamento offline.

## 10. Identidade visual e conteúdo

### Voz da marca

- Portuguesa brasileira, acolhedora e simples.
- Valoriza feito à mão, exclusividade, cuidado, intenção, aconchego, natureza e significado.
- Descrições combinam benefício sensorial/decorativo com informações técnicas objetivas.
- Não faça alegações terapêuticas ou espirituais como fatos verificáveis.
- Preserve avisos de produto, prazo, conteúdo do kit e o que não acompanha a peça.

### Manual de marca e implementação atual

- Paleta digital oficial: violeta `#523A82`, lilás `#9286B2`, pedra `#C4BDAD`, marfim `#EFEBE6` e areia `#B5A07D`.
- Títulos usam **Arches**; textos longos usam **Neulis**. Os arquivos licenciados dessas fontes não estão no repositório, então a aplicação ainda usa Arial/Helvetica como fallback. Não importe cópias de procedência ou licença desconhecida.
- O logo possui versões principal, variação tipográfica e dois ícones. Não distorça, não reduza até perder legibilidade, não aplique sobre fundo sem contraste e respeite a área de proteção indicada no manual.
- O manual mostra combinações preferenciais, mas isso não substitui WCAG: valide contraste de texto e controles. Lilás, pedra e areia podem servir como superfícies ou detalhes sem serem automaticamente adequados para texto pequeno.
- A paleta está centralizada em `src/assets/sass/colors.sass`. Nomes históricos como `pourple` permanecem como aliases para evitar uma renomeação transversal nesta tarefa.
- Cores de erro, sucesso e aviso continuam separadas da paleta institucional; não comunique estado apenas por cor.
- O Angular Material ainda carrega o tema predefinido `indigo-pink`; uma futura tematização deve alinhar componentes Material à paleta e ser validada isoladamente.
- Bootstrap e Bootstrap Icons não fazem parte da aplicação. Use Angular Material para componentes, controles e ícones; use Flexbox/Grid e o Sass local com os tokens/mixins existentes para layout, espaçamento e responsividade.
- Layouts usam Flexbox/Grid, cards, bordas suaves, Material Icons e Angular Material.
- Breakpoints centralizados: `hd` em `max-width: 1400px` e `mobile` em `max-width: 440px`.
- PWA habilitada com service worker e manifesto; valide instalação, cache e atualização ao alterar assets ou rotas.

Para novas telas, reutilize tokens e padrões existentes, mas valide contraste, foco por teclado, labels, textos alternativos, estados de loading/erro/vazio e larguras intermediárias. Evite `100vw` quando puder gerar rolagem horizontal.

## 11. Regras de implementação e revisão

### TypeScript e Angular

- Preserve `strict`, templates estritos e imports standalone.
- Use o control flow atual (`@if`, `@for`) e lazy loading das páginas.
- Um componente/service/interface principal por arquivo; nomes descritivos e consistentes.
- Prefira `unknown` com narrowing a `any`; use `string`, não `String`.
- Modele estados obrigatórios e DTOs de API separadamente do modelo de UI quando necessário.
- Componentes coordenam apresentação; services concentram acesso externo e estado de domínio.
- Não introduza estado em localStorage sem definir chave, schema, expiração, migração e limpeza.

Referências da versão instalada: [componentes Angular v20](https://v20.angular.dev/guide/components), [style guide Angular](https://angular.dev/style-guide) e [TypeScript 5.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html).

### Qualidade mínima por mudança

- Corrigir ou adicionar testes para lógica alterada.
- Executar typecheck e build; distinguir erro anterior de regressão nova.
- Testar manualmente estados feliz, vazio, loading e erro da funcionalidade.
- Para UI: verificar desktop, 440 px e uma largura intermediária; teclado e contraste.
- Para pagamento/frete: usar Sandbox, idempotência, arredondamento, timeout e retry controlado.
- Para PWA: verificar online/offline e atualização do service worker quando pertinente.
- Não “conserte” teste removendo comportamento, rota, validação ou contrato exigido.

### Code Review Rules

- Bloqueie segredos, PII e credenciais em código ou logs.
- Bloqueie chamadas diretas do navegador a APIs que exijam segredo do Cloudinary/PagBank.
- Bloqueie alteração em `main` sem branch e revisão.
- Sinalize contratos enfraquecidos por campos opcionais/casts e erros engolidos por `catch` que retorna sucesso.
- Sinalize assinaturas/subscriptions sem ciclo de vida e headers de autenticação calculados uma única vez.
- Sinalize mudanças que expandem a plataforma de gestão sem decisão de produto e modelo de permissões.

## 12. Orientação para GPT-5.6 Sol e Gemini 3.1 Pro

Este arquivo é a fonte canônica. Codex carrega `AGENTS.md`; o Gemini CLI carrega `GEMINI.md`, que importa este arquivo. Mantenha o conteúdo abaixo do limite padrão de 32 KiB do Codex. Se crescer, mova detalhes para documentos temáticos e deixe aqui apenas regras e links de navegação.

Ao delegar uma tarefa aos modelos, forneça:

- objetivo e critério de conclusão;
- contexto e arquivos relevantes;
- saída esperada;
- limites de autorização e o que deve permanecer inalterado;
- validação exigida.

Não repita a mesma regra em várias seções. Prefira instruções diretas, estrutura estável e evidência de validação.

### Auditoria de documentação - 13/08/2026

| Tema | Resultado incorporado |
| --- | --- |
| GPT-5.6 Sol | ID explícito `gpt-5.6-sol`; prompts mais enxutos, critérios de sucesso e autonomia claros; validar esforço de raciocínio e evitar adoção automática de recursos opcionais. [Guia oficial](https://developers.openai.com/api/docs/guides/latest-model) |
| Codex | `AGENTS.md` é a convenção de instrução persistente, com precedência por diretório e limite padrão de 32 KiB. [Manual](https://learn.chatgpt.com/docs/agent-configuration/agents-md) |
| Gemini 3.1 Pro | ID atual `gemini-3.1-pro-preview`; modelo preview, multimodal e voltado a software/agentes. Instruções críticas no início, objetivo direto e estrutura consistente. [Modelo](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview) e [prompting](https://ai.google.dev/gemini-api/docs/prompting-strategies) |
| Gemini CLI | `GEMINI.md` é o nome padrão e aceita importação `@arquivo`; `AGENTS.md` pode ser configurado em `context.fileName`. [Contexto](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md) |
| Angular 20 / TS 5.8 | Projeto já usa standalone, control flow moderno e TypeScript estrito compatíveis com as versões instaladas; não foi identificada migração obrigatória para esta tarefa. |
| Cloudinary | Upload autenticado no servidor ou direto assinado; segredos ficam fora do front-end. |
| PagBank | Integração vigente deve usar Orders, Sandbox/homologação, Bearer token e idempotência; código EFI é legado. |
| Melhor Envio | Payload de cotação precisa de origem, destino e produto/volume; persistir a cotação usada no checkout quando houver compra de frete. |
| Manual de marca (16/08/2026) | Paleta HEX incorporada aos tokens Sass; Arches/Neulis e arquivos oficiais de logo dependem dos arquivos licenciados/originais antes da aplicação completa. |
| Trello (16/08/2026) | Acesso autenticado confirmado; planejamento consultado como fotografia temporal, sempre subordinado ao código e às decisões humanas mais recentes. |

Ferramentas preparadas nesta curadoria: Poppler 25.07 para inspeção de PDF e servidor MCP oficial `openaiDeveloperDocs` adicionado à configuração global do Codex; uma nova sessão pode ser necessária para descobrir o MCP.

## 13. Definição de pronto

Uma tarefa só está pronta quando:

1. escopo e decisão de produto estão claros;
2. mudança está em branch própria;
3. contratos e comportamento existente foram preservados ou a alteração foi aprovada;
4. typecheck, build e testes pertinentes foram executados;
5. riscos de segurança, acessibilidade e dados foram verificados;
6. documentação durável foi atualizada sem duplicação;
7. entrega informa resultados, evidências, pendências e próximos passos.
