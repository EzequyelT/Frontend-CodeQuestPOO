const dsf_3 = [
  {
    titulo: "Fase 1 – Criar um Habitante",
    initialCode: "# Cria uma classe Habitante e depois cria um objeto\n",
    objectives: [
      { label: "Criar uma classe chamada Habitante" },
      { label: "Criar um objeto chamado aldeao a partir da classe" },
      { label: "Mostrar a mensagem: Objeto criado" },
    ],
    validate: (output) => output.trim() === "Objeto criado",
    hints: {
      error: "Depois de criares a classe, podes criar o objeto com aldeao = Habitante().",
      success: "Boa! Criaste a tua primeira instância 🎉",
    },
  },
  {
    titulo: "Fase 2 – Criar uma Casa",
    initialCode: "# Cria um objeto a partir da classe Casa\n",
    objectives: [
      { label: "Criar uma classe chamada Casa" },
      { label: "Criar um objeto chamado casa_azul" },
      { label: "Mostrar a mensagem: Casa criada" },
    ],
    validate: (output) => output.trim() === "Casa criada",
    hints: {
      error: "Lembra-te: casa_azul = Casa() cria um objeto da classe Casa.",
      success: "Muito bem! A Vila da Lógica ganhou uma nova casa 🏠",
    },
  },
  {
    titulo: "Fase 3 – Criar o Lobo",
    initialCode: "# Cria uma instância da classe Lobo\n",
    objectives: [
      { label: "Criar uma classe chamada Lobo" },
      { label: "Criar um objeto chamado boss" },
      { label: "Mostrar a mensagem: Boss criado" },
    ],
    validate: (output) => output.trim() === "Boss criado",
    hints: {
      error: "Cria a classe Lobo e depois cria o objeto com boss = Lobo().",
      success: "Boa! O Lobo Guardião entrou no jogo 🐺",
    },
  },
];

export default dsf_3;