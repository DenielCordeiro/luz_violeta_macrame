# Revisão dos padrões de criação de código — 01/09/2026

## Objetivo

Explicar as ocorrências apontadas por Daniel após as implementações do Menu lateral e dos Filtros de produtos e converter o aprendizado em critérios verificáveis para os próximos agentes. Esta revisão trata de consistência e processo; não reavalia o comportamento funcional aprovado nessas branches.

## Evidências conferidas

- `.editorconfig` já determinava `indent_style = space` e `indent_size = 4` para os arquivos do repositório.
- O Menu foi entregue pelos agentes nos commits `83b27a7` e `3c9b369`. Daniel fez a revisão `aa59f9e`, aprovou o PR #78 e o merge entrou em `main` por `095a43e`.
- Os Filtros foram entregues nos commits `2abd11f` e `c9c6727`. Em 01/09/2026, o PR #79 continuava aberto em `origin/filtros`; o commit `9355073` apenas incorporava `main` à branch.
- Foram comparados os arquivos antes da intervenção, os arquivos entregues pelos agentes, a revisão de Daniel, o `AGENTS.md` vigente na data das entregas e os apontamentos fornecidos por Fábio.

## O que ocorreu

| Tema | Evidência | Conclusão |
| --- | --- | --- |
| Indentação | O Menu reescrito e seu spec usavam dois espaços. Nos Filtros, TS, HTML e spec usavam tabs, enquanto o Sass usava quatro espaços. | A regra existente no `.editorconfig` não foi aplicada de modo consistente aos arquivos novos. |
| Visibilidade de métodos | Antes da revisão, `MenuComponent`, `DesktopMenuComponent` e `MenuService` continham métodos sem modificador. Daniel acrescentou `public`; o novo `ProductFiltersComponent` já declarava `public` e `private`. | A preferência de Daniel não estava documentada e o legado apresentava exemplos conflitantes. O problema não foi uniforme em todo código novo. |
| Identificadores em inglês | `menuAberto`, `_menuAberto` e `valor` já existiam antes da intervenção. Daniel renomeou os dois primeiros; os identificadores criados nos Filtros já estavam em inglês. | O apontamento formaliza um padrão futuro e também expõe dívida legada; não há evidência de que os Filtros tenham violado essa regra. |
| Bindings no template | O agente adicionou bindings para classe, estado do menu e atributos ARIA. Daniel manteve bindings dinâmicos no Menu aprovado, embora tenha preferido uma marcação mais direta. | Binding não é proibido. Deve ser reservado a estado realmente dinâmico; atributos estáticos devem permanecer em HTML e controles devem usar Angular Material. |

Há uma divergência adicional: o commit `aa59f9e` contém caracteres de tabulação em HTML e Sass, embora o apontamento de Daniel e o `.editorconfig` concordem em quatro espaços. Para evitar que um ajuste manual vire precedente acidental, a regra canônica passa a ser **quatro espaços e nenhum tab**. O commit continua sendo evidência da intenção da revisão, não uma fonte normativa de whitespace.

## Causa raiz

Não foi uma falha única nem um desrespeito deliberado às instruções. Quatro condições se combinaram:

1. O `AGENTS.md` descrevia arquitetura, bibliotecas, segurança, Git e qualidade funcional, mas não explicitava indentação, modificadores de acesso, idioma dos identificadores ou o limite desejado para bindings.
2. A regra de indentação estava isolada no `.editorconfig`, arquivo que o checklist de início não mandava conferir expressamente.
3. O código legado mistura tabs, dois e quatro espaços, métodos com e sem visibilidade e nomes em português e inglês. “Preservar padrões existentes” era ambíguo quando o agente precisava decidir como escrever um arquivo inteiro novo.
4. O projeto não possui lint ou formatador configurado. Typecheck, build, testes e QA visual validaram comportamento, mas não conseguem reprovar esses quatro aspectos de estilo.

Isso explica a diferença percebida por Daniel: numa alteração localizada, o contexto imediato restringe as escolhas e o agente tende a preservar a estrutura; num arquivo novo, lacunas e exemplos contraditórios dão espaço para convenções genéricas do modelo ou da ferramenta.

## Decisão incorporada ao projeto

O `AGENTS.md` agora define explicitamente:

- quatro espaços por nível em TS, HTML, Sass e specs, sem tabs;
- visibilidade em todo método de classe, exceto `constructor` e lifecycle hooks do Angular;
- identificadores em inglês e conteúdo visível ao usuário em português brasileiro;
- HTML estático sem binding, Angular Material para controles e bindings somente para dados ou estados dinâmicos;
- inspeção do arquivo novo inteiro e validação manual desses critérios, pois o pipeline atual não os impõe.

Essas regras valem também para trechos novos em arquivos existentes, mas não autorizam reformatação transversal de legado fora do escopo.

## Checklist para criação de arquivos

1. Ler `.editorconfig`, a seção 11 do `AGENTS.md` e um arquivo análogo aceito por Daniel.
2. Separar padrão intencional de inconsistência legada; em conflito, seguir a regra canônica documentada.
3. Criar o arquivo com quatro espaços, quebra de linha final e identificadores em inglês.
4. Declarar a visibilidade dos métodos de classe, respeitando apenas as exceções documentadas.
5. Revisar o template: literal para valor estático, binding para estado dinâmico e Material para controles.
6. Executar as validações funcionais pertinentes e `git diff --check`.
7. Inspecionar todos os arquivos novos antes do commit; aprovação funcional não substitui revisão de consistência.

## Limite desta revisão

Não foi configurado lint/formatador e nenhum arquivo funcional foi reformatado. Uma automação futura deve ser proposta em branch própria, sem atualização automática de dependências, e precisa distinguir violações novas da dívida preexistente para não gerar um diff transversal.
