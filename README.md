niveis{
    desafios
}
🌲 Floresta → fundamentos (variáveis, lógica simples)
Floresta dos Algoritmos — Sugestão de Níveis e Desafios
Nível	Número de desafios	Descrição rápida
Nível 1	3	Fundamentos de lógica: variáveis, prints e atenção à sintaxe básica.
Nível 2	3	Introdução a condicionais simples (if/else), pequenas escolhas de lógica.
Nível 3	2	Combinação de variáveis e condições, preparação para o boss final.

✅ Total: 3 níveis, 8 desafios → ideal para o primeiro mapa.

💡 Dicas de implementação:
Nível 1:
Corrigir erros de sintaxe simples (print, parênteses, aspas)
Explorar variáveis básicas
Nível 2:
Pequenos trechos de código com if e else
Questões de verdadeiro/falso sobre lógica
Nível 3:
Mistura de variáveis + condições
Pequenos códigos para corrigir
Prepara para o Boss: Serpente do Bug

🏘️ Vila → estruturas e funções

🏰 Castelo → POO (herança, encapsulamento, polimorfismo)

Título do jogador baseado no XP:

Level	XP necessário	Título
1	0	Aprendiz
2	80	Explorador
3	180	Programador
4	320	Mestre do Código
5 (MAX)	500	Guardião do Código


________________________________________________________________________________________

✅ O que já está feito
🟡 Em progresso
🔴 O que falta fazer (organizado por prioridade)
Funcionalidades Concluídas

1.1 Base de Dados

-Estrutura da base de dados criada e normalizada
-Tabelas principais implementadas:
-alunos
-herois
-mapas
-niveis
-desafios
-desempenho_desafio
-erros
-Relações entre tabelas configuradas com chaves estrangeiras
-Sistema preparado para análise e expansão futura com IA

1.2 Autenticação

-Registo de conta funcional
-Login funcional
-Sistema de autenticação ativo e operacional
-Integração de registo de utilizadores com estrutura preparada para envio de emails futuros (Gmail)

1.3 Dashboard do Jogador

-Dashboard ligado a dados reais da base de dados
-Informação apresentada corretamente:
-Mapa atual
-Nível atual
-Progresso
-Tempo total de jogo (calculado e atualizado)
-XP integrado e funcional
-Sistema de streak baseado em respostas corretas consecutivas

1.4 Sistema de Mapas e Níveis

-Mapa 1 (Floresta dos Algoritmos) ligado à base de dados
-Carregamento dinâmico de níveis
-Carregamento dinâmico de desafios
-Estrutura preparada para expansão para novos mapas
-Integração com tabela desempenho_desafio

1.5 Tipos de Desafios

-Quiz de escolha múltipla
-Exercícios de arrastar respostas
-Exercícios de código simples em Python
-Validação automática de respostas implementada
-Sistema de tentativas por desafio

1.6 Sistema de XP e Progressão

-Atribuição de XP ao completar desafios
-XP por nível concluído
-Atualização automática de XP do aluno
-Feedback de progresso implementado (estrutura preparada para animações)
-Desbloqueio automático do próximo nível
-Atualização de:
-nivel_atual
-mapa_atual
-Verificação de conclusão de mapa
-Sistema de títulos por XP

1.7 Gestão de Progresso e Tempo

-Sistema de registo de tempo de jogo implementado
-Criação de tabela JogadorTempo
-Criação de tabela Sessao para controlo de sessões

1.8 Sistema de Reset Semanal

-Implementado reset automático semanal baseado na última data de reset
-Estrutura preparada para manutenção de consistência de dados de atividade
-Funcionalidades em Desenvolvimento / Planeadas

1.9 Histórico de Semanas

-Criação de tabela historico_semanas
-Objetivo:
-Guardar tempo semanal do jogador
-Permitir consulta de histórico de atividade
-Suporte a análise de desempenho ao longo do tempo
-Base para sistema de streak diário/semanal


2.0 Comunicação e Emails

-Integração futura com Gmail
-Envio de emails de:
-Registo de conta

2.1 Sistema de Streak Diário

-ncrementar streak automaticamente
-Reset automático caso falhe um dia
 !Ligação com recompensas (coins ou XP extra)!

___Melhorar___________________________________
3.3.1 Perfil do Jogador

com os trofeus do aluno la tbm

_______________________________________________________________________________
-Resumo semanal
-Notificações de progresso
-Estado Geral do Projeto
-Backend estruturado e funcional
-Base de dados normalizada e escalável
-Sistemas principais (autenticação, progresso, XP, mapas) operacionais
-Sistema de tempo e atividade já implementado com lógica semanal
-Projeto preparado para expansão (IA, análises e gamificação avançada)
_______________________________________________________________________________

🟡 Em Desenvolvimento

2.1 Sistema de Desafios (CORE DO JOGO)

Estrutura geral já implementada
Ainda em falta:
Associação do aluno ao herói escolhido
Sistema de feedback ao jogador após cada tentativa
________________________________________________________________________________

🔴 3.1 PRIORIDADE ALTA — Gameplay Base

3.1.1 Sistema de Desafios (Core Final)

Implementar sistema de feedback imediato:
coins (quando implementado)

3.1.2 Sistema de Coins

Implementar moeda do jogo (coins)
Ganhos de coins:
streak diário
Sistema de consumo:
compra de dicas
desbloqueios futuros
Integração com dashboard e perfil do jogador


3.2 PRIORIDADE MÉDIA — Progressão e Conteúdo

3.2.1 Mapas 2 e 3

Criar estrutura na base de dados
Inserir níveis e desafios
Ligar ao sistema existente de progressão
Garantir escalabilidade igual ao Mapa 1

3.2.2 Sistema de Feedback Inteligente (IA)

Registar tipo de erro do aluno:
conceptual
sintático
lógico
Gerar feedback automático:
explicativo (explica o erro)
verificativo (indica o que está errado)
estratégico (como melhorar)
Mostrar feedback contextual no frontend

3.3 PRIORIDADE BAIXA — Experiência do Utilizador


Estatísticas completas:
Tipos de erro mais frequentes

3.3.2 Cutscenes / Narrativa

Introdução de mapas
Introdução de bosses

3.3.3 Gamificação Extra

Loja de dicas (usando coins)
Sistema de leaderboard (ranking global ou por mapa)
Sistema de conquistas (achievements):
“sem erros em 5 desafios”
“streak de 7 dias”
“primeiro mapa completo”
Melhorias Adicionais Recomendadas (Sugestão de Valor do Projeto)

4.2 Sistema de Explicação Pós-Erro (Replay Learning)

Mostrar ao jogador:
o que ele respondeu
qual seria a resposta correta
explicação passo a passo
Guarda na base de dados para revisão futura


_____________________________________________________________

Sistemas de amigos: perfil pode ver seu id, pode se enviar solicitação de amizades
_____________________________________________________________


4.5 Sistema de Avaliação Automática de Progresso

Classificação do jogador:
Iniciante
Intermédio
Avançado
Mestre
Baseado em:
XP
erros
consistência
Estado Geral Atual
Backend sólido e bem estruturado
Base de dados evoluída e escalável
Sistemas principais já funcionais (auth, XP, tempo, mapas)
Sistema de desafios é o núcleo que ainda precisa ser fechado
Projeto já está numa fase avançada de gamificação, faltando principalmente:
lógica final de gameplay
moedas
streak diário
___________________________________________________________________
Admin poder criar mapas niveis e desafios
___________________________________________________________________
🌲 MAPA 1 — Floresta dos Algoritmos

👉 Aprender a programar

Conteúdo:

Variáveis
Tipos de dados
Operadores
Condições (if)

Objetivo:
👉 Entender lógica básica e como o código funciona

Resultado:
✔ O aluno consegue escrever código simples
✔ Consegue tomar decisões no código

🏘️ MAPA 2 — Vila da Lógica

👉 Introdução à POO (objetos)

Conteúdo:

Classes (class)
Objetos (instâncias)
__init__
Atributos
Métodos

Objetivo:
👉 Entender que código representa coisas do mundo real

Resultado:
✔ Sabe criar objetos
✔ Entende dados + comportamento
✔ Começa a “pensar em objetos”

🏰 MAPA 3 — Castelo do Caos

👉 POO na prática (pensamento real)

Conteúdo:

Encapsulamento (básico)
Estado do objeto
Interação entre objetos
Herança
Polimorfismo

Objetivo:
👉 Modelar sistemas reais com código

Resultado:
✔ Consegue estruturar sistemas
✔ Entende relações entre objetos
✔ Pensa como programador

🐉 BOSS FINAL

👉 Projeto prático (RPG / sistema simples)

Objetivo:

Aplicar tudo junto
Criar algo funcional

Resultado:
✔ Consolidação total do aprendizado

🧠 RESUMO FINAL (1 linha)
🌲 Mapa 1 → lógica
🏘️ Mapa 2 → objetos
🏰 Mapa 3 → sistemas

Admin:

média de tempo da plataforma
retenção semanal
DAU/WAU/MAU
jogadores ativos
taxa de abandono
semanas mais fortes
