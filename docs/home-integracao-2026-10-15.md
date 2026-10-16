# Integração da home — 15/10/2026

Esta etapa continua a home visual documentada em `home-2026-10-15.md`, seguindo o plano aprovado por Fábio. A branch `home-integracao` parte de `home-visual` em `0028768`; o PR de composição #85 ainda está aberto. A integração deve ser revisada como alteração dependente, sem merge automático.

## Comportamento entregue

- A vitrine consulta `ProductsService.getProducts(1, 3)` e apresenta até três registros com ID e nome válidos, na ordem recebida. Não há classificação como novidade ou mais vendido. Preços finitos e não negativos são formatados em reais; dados ausentes não são inventados. Foto ausente ou quebrada recebe indicação neutra. Não há compra direta na home.
- O componente da vitrine tem estados próprios: carregamento, erro com nova tentativa e vazio. Após dez segundos sem resposta, mostra erro; respostas de uma tentativa expirada não sobrescrevem a nova tentativa. A home editorial permanece disponível. Nenhum produto de demonstração foi incluído na aplicação.
- Cada card abre `/product/:product_id`. O detalhe consulta o ID da rota, responde à troca de parâmetro e ignora respostas anteriores que cheguem atrasadas. Não exibe uma peça anterior salva no navegador e mostra carregamento/erro com nova tentativa. Os endpoints e o formato da API foram preservados.
- Cabeçalho e menu oferecem login existente ou `/profile`; visitantes podem abrir `/register`. Estado de apresentação compartilhado por signal em AuthService acompanha login, fechamento do diálogo e logout, sem mudar token, payload ou estratégia de autenticação. O formulário de login tem submit por teclado, controles acessíveis de fechar/mostrar senha, mensagem de falha e proteção contra envios duplicados.
- Menu fecha inclusive no destino já aberto. Links públicos para catálogo, ateliê, processo, história e carrinho são equivalentes em desktop e mobile. Dashboard não foi exposto ao público nem recebeu nova lógica de autorização.
- Nome da marca e Início apontam para `/home#top`; âncoras consideram os 76 px do cabeçalho e funcionam também ao selecionar novamente o mesmo endereço. Pular conteúdo mantém a página atual e transfere foco ao main.
- Sobre apresenta marca, Camila e processo a partir dos fatos já documentados. Controles administrativos vazios e placeholder de redes sociais foram retirados da apresentação pública. O mock histórico não é mais importado pela página; services de About não foram alterados.
- Home inclui CTA secundário para ateliê, CTA após o processo e acesso final ao catálogo. Rodapé também inclui ateliê e processo. Imagens editoriais continuam identificadas como ilustrativas; os cards da vitrine usam apenas fotos da API.

## Decisão futura: destaques administrados

Ainda não implementado. Administradores poderão marcar e desmarcar produtos como destaque no catálogo. O back-end deverá persistir a marcação e o instante em que ocorreu, aplicar autorização e ordenar os produtos. Havendo mais de três marcados, a home exibirá os três marcados mais recentemente. Editar preço, nome ou descrição não muda a ordem; desmarcar e marcar novamente gera novo instante de marcação. Havendo menos de três, completar com produtos não repetidos na ordem normal do catálogo.

O contrato, a persistência e as permissões serão definidos com Daniel antes dessa evolução. Nenhuma flag local, campo de API ou painel administrativo foi criado nesta etapa.

## Validação e limites

- Typecheck: `corepack pnpm exec tsc --noEmit -p tsconfig.app.json`.
- Build: `corepack pnpm build`; passou sem alteração de budgets. Bundle inicial 898,30 kB; Sass da home 3,47 kB, abaixo do limite de erro de 4 kB; produto 3,81 kB; aviso CommonJS de quill-delta. A vitrine isolada ficou abaixo do aviso de estilo de 2 kB.
- Os 25 testes direcionados com `tsconfig.home-spec.json` passaram. Cobrem vitrine de zero a três itens, ordem, preço/foto ausentes, falha, timeout/retry, rotas da home, detalhe autoritativo por URL e respostas atrasadas, login/conta/logout, menu e acessibilidade da navegação.

```powershell
corepack pnpm exec ng test --watch=false --browsers=ChromeHeadless --ts-config=tsconfig.home-spec.json --include=src/app/app.component.spec.ts --include=src/app/home/**/*.spec.ts --include=src/app/header/menu/menu.component.spec.ts --include=src/app/header/login/login.component.spec.ts --include=src/app/products/product/product.component.spec.ts --include=src/app/services/menu/menu.service.spec.ts
```

- Suíte completa: `corepack pnpm exec ng test --watch=false --browsers=ChromeHeadless` permanece bloqueada pelos erros anteriores nos specs genéricos de products/payments e por `BaseAPI<T>.data` em pagamentos.
- Chrome em 1440, 1000, 768, 440 e 360 px: sem overflow na home. Verificados também cabeçalho autenticado, fotos ausentes/quebradas, todos os links do menu, formulário com falha/retry, perfil/cadastro, voltar e acesso direto/refresh/nova aba de produto. Sobre inspecionado em desktop e mobile. Âncora do processo ficou a aproximadamente 76 px do topo, inclusive com catálogo atrasado.
- Teclado: pular conteúdo mantém inclusive `/about`, controles de login são botões/links, cards têm nome acessível e foco visível. Novas superfícies reutilizam os contrastes institucionais já verificados na etapa visual.
- Produção local: service worker ativo e recarga offline da home após primeira visita. Catálogo não tem cache de dados acrescentado; indisponibilidade não é substituída por preços fictícios. Instalação e atualização de uma instalação antiga não foram testadas.
- A API real em `localhost:3333` estava indisponível. Cenários de sucesso foram testados com respostas sintéticas interceptadas apenas no navegador de teste e mocks nos specs. A falha real de conexão também foi conferida. Ainda é necessária uma verificação integrada com o back-end disponível para validar seu contrato efetivo e a sessão real; não foram executadas compras ou alterações de clientes.
- `git diff --check`, inspeção de arquivos novos e verificação de indentação nas linhas adicionadas. Sem dependências, imagens ou lockfiles novos nesta integração.

Documentação consultada para a versão 20: [ViewportScroller](https://v20.angular.dev/api/common/ViewportScroller) e [takeUntilDestroyed](https://v20.angular.dev/api/core/rxjs-interop/takeUntilDestroyed). Confirmaram os padrões existentes, sem necessidade de nova regra durável no AGENTS.md.

## Refinamento do cabeçalho — 16/10/2026

Continuação da home na branch `cabecalho`, baseada em `home-integracao` (9c116b8). Desktop: marca à esquerda, navegação centralizada com Peças em destaque e ações de conta/sacola à direita; margens laterais fluidas de 16 a 48 px. Até 900 px, navegação migra para a lateral, hambúrguer fica à esquerda e a marca permanece centralizada na tela, com conta e sacola à direita. Ícones de 24 px em controles de 44 × 44 px. Conta conserva login/perfil e nome acessível, sem rótulo visual no cabeçalho.

Menu lateral em marfim/violeta, com links existentes, conteúdo oculto fora da tabulação, animação reduzida conforme preferência do sistema, Escape com retorno de foco e fechamento ao voltar ao desktop. `BreakpointObserver` do CDK instalado acompanha a mesma media query do Sass; sem nova dependência. Referência conferida: https://material.angular.dev/cdk/layout/overview.

Validação: typecheck, build e sete testes direcionados de menu/login aprovados; `git diff --check` aprovado. Chrome nas larguras 320, 360, 440, 768, 900, 901, 1000 e 1440 px: centralização, ausência de sobreposição/overflow, controles de 44 px, menu, Escape, redimensionamento, link para Sobre e diálogo de login. Capturas desktop/mobile e menu conferidas. Avisos anteriores de budget (home/produto/bundle inicial) e CommonJS permanecem. Esta entrega não revalida autenticação com a API real nem a suíte completa, cujos bloqueios anteriores estão descritos acima.
