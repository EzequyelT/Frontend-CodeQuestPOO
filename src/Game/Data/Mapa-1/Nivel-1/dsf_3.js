const dsf_3 = [
  {
    titulo: "Fase 1 – Soma Simples",
    initialCode: "# Soma dois números\n",
    objectives: [
      { label: "Criar duas variáveis com números 10 e 5" },
      { label: "Somar os valores" },
      { label: "Mostrar o resultado com print()" },
    ],
    validate: (output) => output.trim() === "15",
    hints: {
      error: "Lembra-te: a soma em Python se faz com +",
      success: "Boa! Somaste corretamente 🎉"
    }
  },
  {
    titulo: "Fase 2 – Multiplicação",
    initialCode: "# Multiplica valores\n",
    objectives: [
      { label: "Criar duas variáveis a e b" },
      { label: "Multiplicar os valores e o resultado tem que ser 50" },
      { label: "Mostrar o resultado com print()" },
    ],
    validate: (output) => output.trim() === "50",
    hints: {
      error: "Lembra-te: a multiplicação em Python usa *",
      success: "Boa! Multiplicaste corretamente 🎉"
    }
  },
  {
    titulo: "Fase 3 – Comparação",
    initialCode: "# Compara dois valores\n",
    objectives: [
      { label: "Criar duas variáveis a e b" },
      { label: "Comparar usando > ou ==" },
      { label: "Mostrar True" },
    ],
    validate: (output) => output.trim() === "True",
    hints: {
      error: "Algo não está correto na comparação. Verifica se estás a usar > ou == corretamente.",
      success: "Boa! Multiplicaste corretamente 🎉"
    }
  },
]

export default dsf_3