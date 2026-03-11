<h1> Documentação do Desafio — TESS Command Center <br> </h1>

<h3>Visão Geral</h3>

O TESS Command Center é uma interface de monitoramento projetada para visualizar e interagir com múltiplos agentes de IA executando tarefas simultaneamente.

A interface foi pensada como um painel operacional, priorizando escaneabilidade, feedback visual claro e observabilidade das ações dos agentes.

O objetivo é permitir que o usuário entenda rapidamente quais agentes estão ativos, o que estão fazendo e qual o progresso das tarefas.


<h3>1. Ferramentas de IA utilizadas</h3>

Google AI Studio (Gemini 3.1 Pro):
Utilizado como assistente de desenvolvimento para estruturar componentes React, auxiliar na lógica reativa de simulação dos agentes e refinar microinterações e animações com Framer Motion.

Outros modelos (ChatGPT, Claude e Grok):
Utilizados pontualmente para validação de decisões de UI/UX, revisão de escaneabilidade da interface e análise de possíveis melhorias de usabilidade.

<h3>2. Decisão de UX: Context-Aware Logging</h3>

Em ambientes com múltiplos agentes executando tarefas simultaneamente, exibir todos os logs ao mesmo tempo pode gerar excesso de informação.

Para reduzir esse problema, o sistema implementa logs sensíveis ao contexto: ao selecionar um agente, o painel de atividades exibe apenas os logs relacionados a ele.

Isso reduz a carga cognitiva e facilita o entendimento do que cada agente está executando.

<h3>3. Decisões de Design</h3>

Desktop-first interface:
O Command Center foi projetado priorizando uso em desktop, já que ferramentas de monitoramento e orquestração de IA normalmente são utilizadas em ambientes operacionais com telas maiores.

Uso de cores semânticas:
Embora a interface siga a estética minimalista da Tess, cores foram utilizadas para indicar estados do sistema (executando, pensando, concluído). Isso melhora a escaneabilidade em um ambiente de monitoramento.

Navegação com baixo peso visual:
A sidebar foi projetada com menor destaque visual para manter o foco nas informações principais: agentes, progresso e logs.

<h3>4. O que faria com mais tempo</h3>

Filtros de log:
Adicionar filtros por tipo de evento (Error, Warning, Info, Debug) e busca dentro do terminal.

Tess Nest:
Integrar a criação e organização de agentes diretamente no Command Center.

Painel de métricas:
Expandir a seção Analytics para mostrar métricas como uso de tokens, tempo de execução e custo estimado por agente.
