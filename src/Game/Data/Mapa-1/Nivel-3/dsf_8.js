const dsf_8 = [
    {
        titulo: "Fase 1 – Contar números pares",
        initialCode: "# Imprime apenas números pares de 0 a 6\n",
        objectives: [
            { label: "Usar um loop for com range(7)" },
            { label: "Usar uma condição if para verificar números pares" },
            { label: "Imprimir apenas os pares" },
        ],
        validate: (output) => output.trim() === "0\n2\n4\n6",
        hints: {
            idle: "Chegámos ao boss final da floresta… prepara-te para o confronto!",
            error: "A Serpente resiste… lembra-te: usa if i % 2 == 0.",
            success: "Golpe certeiro! Dominas loops e condições ⚔️"
        }
    },

    {
        titulo: "Fase 2 – Soma condicional",
        initialCode: "# Soma apenas números maiores que 3 entre 1 e 6\nsoma = 0\n",
        objectives: [
            { label: "Usar um loop for com range(1, 7)" },
            { label: "Usar if para verificar valores maiores que 3" },
            { label: "Somar apenas esses valores" },
            { label: "Mostrar o resultado final" },
        ],
        validate: (output) => output.trim() === "15",
        hints: {
            error: "A magia falhou… soma apenas quando i > 3.",
            success: "Boa! A tua lógica está cada vez mais afiada 💪"
        }
    },

    {
        titulo: "Fase 3 – Contador de positivos",
        initialCode: "# Conta quantos números positivos existem na lista\nnumeros = [-2, 5, -1, 3, 0]\ncontador = 0\n",
        objectives: [
            { label: "Percorrer a lista com um loop" },
            { label: "Verificar números maiores que 0" },
            { label: "Incrementar contador" },
            { label: "Mostrar o total" },
        ],
        validate: (output) => output.trim() === "2",
        hints: {
            error: "A Serpente confunde-te… usa if n > 0.",
            success: "Excelente! Já controlas o fluxo da batalha 🔥"
        }
    },

    {
        titulo: "Fase 4 – Encontrar o maior número",
        initialCode: "# Encontra o maior número da lista\nnumeros = [3, 7, 2, 9, 5]\nmaior = 0\n",
        objectives: [
            { label: "Percorrer a lista com loop" },
            { label: "Comparar valores" },
            { label: "Atualizar variável maior" },
            { label: "Mostrar o resultado final" },
        ],
        validate: (output) => output.trim() === "9",
        hints: {
            error: "Ainda não é o golpe final… usa if n > maior.",
            success: "A Serpente enfraquece… está quase derrotada!"
        }
    },

    {
        titulo: "Fase 5 – Desafio Final: Código Seguro",
        initialCode: "# Verifica passwords seguras\npasswords = ['123', 'abc123', 'segura123']\n",
        objectives: [
            { label: "Percorrer a lista de passwords" },
            { label: "Verificar se têm mais de 5 caracteres" },
            { label: "Imprimir apenas as válidas" },
        ],
        validate: (output) => output.trim() === "abc123\nsegura123",
        hints: {
            error: "Última defesa da Serpente… valida com len(p) > 5.",
            success: "Vitória! Derrotaste a Serpente e protegeste o código 🐍⚔️"
        }
    }
]

export default dsf_8;