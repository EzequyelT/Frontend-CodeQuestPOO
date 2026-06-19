const dsf_2 = [
  {
    titulo: "Fase 1 – A Primeira Casa",
    initialCode: "# Cria uma classe chamada Casa\n",
    objectives: [
      { label: "Criar uma classe chamada Casa" },
      { label: "Usar pass dentro da classe" },
      { label: "Mostrar a mensagem: Molde criado" },
    ],
    validate: (output) => output.trim() === "Molde criado",
    hints: {
      error: "Lembra-te: para criar uma classe em Python usa class Casa:",
      success: "Boa! Criaste o primeiro molde da vila 🎉",
    },
  },
  {
    titulo: "Fase 2 – Molde do Habitante",
    initialCode: "# Cria uma classe chamada Habitante\n",
    objectives: [
      { label: "Criar uma classe chamada Habitante" },
      { label: "Usar pass dentro da classe" },
      { label: "Mostrar a mensagem: Habitante preparado" },
    ],
    validate: (output) => output.trim() === "Habitante preparado",
    hints: {
      error: "Verifica se criaste a classe Habitante e se usaste print() corretamente.",
      success: "Excelente! A vila já tem um molde para habitantes 🏘️",
    },
  },
  {
    titulo: "Fase 3 – Molde do Lobo",
    initialCode: "# Cria uma classe chamada Lobo\n",
    objectives: [
      { label: "Criar uma classe chamada Lobo" },
      { label: "Usar pass dentro da classe" },
      { label: "Mostrar a mensagem: Lobo preparado" },
    ],
    validate: (output) => output.trim() === "Lobo preparado",
    hints: {
      error: "A classe deve chamar-se Lobo. Depois mostra a mensagem com print().",
      success: "Boa! Criaste o molde do futuro boss da vila 🐺",
    },
  },
];

export default dsf_2;