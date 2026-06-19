const dsf_7 = [
  {
    titulo: "Fase 1 – Apresentação do Habitante",
    initialCode: "# Cria um método apresentar()\n",
    objectives: [
      { label: "Criar uma classe Habitante" },
      { label: "Guardar o nome no objeto" },
      { label: "Criar o método apresentar()" },
      { label: "Mostrar: Eu sou Rui" },
    ],
    validate: (output) =>
      output.trim() === "Eu sou Rui",
    hints: {
      error: "Dentro do método usa self.nome.",
      success: "Boa! O método consegue usar os atributos 🎉",
    },
  },

  {
    titulo: "Fase 2 – Ferramenta Especial",
    initialCode: "# Cria um método descrever()\n",
    objectives: [
      { label: "Criar uma classe Ferramenta" },
      { label: "Guardar o nome da ferramenta" },
      { label: "Criar um método descrever()" },
      { label: "Mostrar: Ferramenta: Martelo" },
    ],
    validate: (output) =>
      output.trim() === "Ferramenta: Martelo",
    hints: {
      error: "O método deve usar self.nome.",
      success: "Excelente! O método já lê dados do objeto 🔨",
    },
  },

  {
    titulo: "Fase 3 – Rugido de Fenrir",
    initialCode: "# Cria um método rugir()\n",
    objectives: [
      { label: "Criar uma classe Lobo" },
      { label: "Guardar o nome do lobo" },
      { label: "Criar um método rugir()" },
      { label: "Mostrar: Fenrir rugiu!" },
    ],
    validate: (output) =>
      output.trim() === "Fenrir rugiu!",
    hints: {
      error: "Dentro do método usa self.nome.",
      success: "Fenrir ganhou voz 🐺",
    },
  },
];

export default dsf_7;