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

📘 Estado Atual do Projeto — CodeQuestPOO
✅ 1. Funcionalidades Já Implementadas
🗄️ Base de Dados
✅ Estrutura da base de dados criada e normalizada
✅ Tabelas principais implementadas:
alunos
herois
mapas
niveis
desafios
desempenho_desafio
erros
✅ Relações com chaves estrangeiras configuradas
✅ Sistema preparado para análise por IA
🔐 Autenticação
✅ Registo de conta funcional
✅ Login funcional
✅ Sistema de autenticação ativo
📊 Dashboard
✅ Dashboard ligado aos dados reais do jogador
✅ Mostra corretamente:
mapa atual
nível atual
progresso
tempo total de jogo (já calculado)
✅ Dados puxados diretamente da base de dados

⚠️ Já preparado mas ainda sem lógica automática:

XP
Coins
Streak
🗺️ Sistema de Mapas
✅ Mapa 1 (Floresta dos Algoritmos) ligado à BD
✅ Níveis carregados dinamicamente
✅ Desafios carregados da base de dados
✅ Estrutura escalável para novos mapas



🟡 2. Em Desenvolvimento

🎯 Sistema de Desafios
🔄 Estrutura pronta

❌ Falta implementar:

Associação do aluno ao herói escolhido
lógica das respostas
validação das respostas
feedback ao jogador
ligação ao desempenho_desafio

🔴 3. O Que Falta Fazer (Organizado por Prioridade)

🥇 PRIORIDADE ALTA — Gameplay Base

🎮 Sistema de Desafios (CORE DO JOGO)
 Criar desafios do Mapa 1
 Implementar tipos:

quiz escolha múltipla
arrastar respostas

código simples Python
 Validação automática das respostas
 Guardar resultado em desempenho_desafio
 Sistema de tentativa
⭐ Sistema de XP
 Atribuir XP ao completar desafio
 XP por nível concluído
 Atualizar XP automaticamente no aluno
 Mostrar animação/feedback de ganho
💰 Sistema de Coins
 Coins por resposta correta
 Coins por completar nível
 Integração com sistema de dicas
🔥 Sistema de Streak
 Guardar último login
 Verificar login diário
 Incrementar streak
 Reset se faltar um dia
🥈 PRIORIDADE MÉDIA — Progressão
🧭 Progressão entre níveis
 Desbloquear próximo nível automaticamente
 Atualizar nivel_atual
 Atualizar mapa_atual
 Verificar conclusão do mapa
🗺️ Mapas 2 e 3
 Criar níveis na BD
 Inserir desafios
 Conectar frontend
🤖 Sistema de Feedback IA
 Guardar tipo de erro
 Gerar feedback:
verificativo
explicativo
estratégico
 Mostrar feedback ao jogador
🥉 PRIORIDADE BAIXA — Experiência
👤 Perfil do Jogador
 Estatísticas completas
 Histórico de desempenho
 Tipo de erro mais comum
🎬 Cutscenes
 Introdução do mapa
 Introdução do boss
 Explicação do nível
🏆 Gamificação Extra
 Loja de dicas (coins)
 Leaderboard (opcional)
 Títulos por XP
s
                                   |
                                                                                        |
                                                                                        |
________________________________________________________________________________________|
