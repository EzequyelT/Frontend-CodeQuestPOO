const dsf_6 = [
  {
    titulo: "Fase 1 – Dois Habitantes",
    initialCode: "# Cria dois habitantes da vila\n",
    objectives: [
      { label: "Criar uma classe Habitante" },
      { label: "Usar __init__ para guardar o nome" },
      { label: "Criar um habitante chamado Rui" },
      { label: "Criar um habitante chamado Ana" },
      { label: "Mostrar Rui e Ana em linhas separadas" },
    ],
    validate: (output) =>
      output.trim() === "Rui\nAna",
    hints: {
      error: "Cria dois objetos diferentes da mesma classe.",
      success: "Boa! Uma classe pode criar muitos objetos 🏘️",
    },
  },

  {
    titulo: "Fase 2 – As Casas da Vila",
    initialCode: "# Cria duas casas\n",
    objectives: [
      { label: "Criar uma classe Casa" },
      { label: "Guardar a cor da casa" },
      { label: "Criar uma casa Azul" },
      { label: "Criar uma casa Vermelha" },
      { label: "Mostrar Azul e Vermelha" },
    ],
    validate: (output) =>
      output.trim() === "Azul\nVermelha",
    hints: {
      error: "Usa a mesma classe para criar duas casas diferentes.",
      success: "Excelente! O molde gera várias casas 🏠",
    },
  },

  {
    titulo: "Fase 3 – A Alcateia",
    initialCode: "# Cria dois lobos\n",
    objectives: [
      { label: "Criar uma classe Lobo" },
      { label: "Guardar o nome em self.nome" },
      { label: "Criar Fenrir" },
      { label: "Criar Skoll" },
      { label: "Mostrar Fenrir e Skoll" },
    ],
    validate: (output) =>
      output.trim() === "Fenrir\nSkoll",
    hints: {
      error: "Cria dois objetos diferentes da classe Lobo.",
      success: "A alcateia está formada 🐺🐺",
    },
  },
];

export default dsf_6;