const dsf_6 = [
  {
    titulo: "Fase 1 – Contagem Simples",
    initialCode: "# Usa um loop for para contar de 0 a 4\n",
    objectives: [
      { label: "Criar um loop for com range(5)" },
      { label: "Imprimir cada valor com print(i)" },
      { label: "Fazer a contagem aparecer de 0 a 4" },
    ],
    validate: (output) => output.trim() === "0\n1\n2\n3\n4",
    hints: {
      error: "Lembra-te: range(5) vai de 0 até 4 e tens de usar print(i)",
      success: "Boa! Já sabes usar loops for 🎉"
    }
  },
  {
    titulo: "Fase 2 – Soma em Loop",
    initialCode: "# Soma valores de 1 a 5\nsoma = 0\n",
    objectives: [
      { label: "Usar um loop for com range(1, 6)" },
      { label: "Somar cada valor à variável soma" },
      { label: "Mostrar o resultado final com print(soma)" },
    ],
    validate: (output) => output.trim() === "15",
    hints: {
      error: "Dica: a operação soma += i deve ser feita dentro do loop, e o print(soma) tem de estar fora do loop.",
      success: "Boa! Conseguiste acumular valores 🎉"
    }
  },
  {
    titulo: "Fase 3 – Multiplicação em Loop",
    initialCode: "# Multiplica valores de 1 a 4\nresultado = 1\n",
    objectives: [
      { label: "Usar loop for com range(1, 5)" },
      { label: "Multiplicar cada valor em resultado" },
      { label: "Mostrar o resultado final com print()" },
    ],
    validate: (output) => output.trim() === "24",
    hints: {
      error: "Dica: A variável do resultado tem de começar em 1, e depois deves fazer resultado *= i dentro do ciclo.",
      success: "Excelente! Já dominas multiplicação em loops 💪"
    }
 }
]

export default dsf_6;