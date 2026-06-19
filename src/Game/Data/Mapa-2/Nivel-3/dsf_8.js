const dsf_8 = [
  {
    titulo: "Boss 1 – O Estábulo Real",
    initialCode: "# Cria cavalos do reino\n",
    objectives: [
      { label: "Criar uma classe Cavalo" },
      { label: "Usar __init__ para guardar o nome" },
      { label: "Criar dois cavalos: Trovão e Faísca" },
      { label: "Mostrar os nomes dos dois cavalos" },
    ],
    validate: (output) =>
      output.trim() === "Trovão\nFaísca",
    hints: {
      error: "Cria dois objetos diferentes da classe Cavalo.",
      success: "Os cavalos estão prontos para a viagem 🐎",
    },
  },

  {
    titulo: "Boss 2 – Torre dos Magos",
    initialCode: "# Cria um mago que lança feitiços\n",
    objectives: [
      { label: "Criar uma classe Mago" },
      { label: "Guardar o nome do mago" },
      { label: "Criar um método lancar_feitico()" },
      { label: "Mostrar: Merlin lançou um feitiço!" },
    ],
    validate: (output) =>
      output.trim() === "Merlin lançou um feitiço!",
    hints: {
      error: "Usa self.nome dentro do método.",
      success: "A magia foi dominada ✨",
    },
  },

  {
    titulo: "Boss 3 – Frota dos Céus",
    initialCode: "# Controla dirigíveis da cidade\n",
    objectives: [
      { label: "Criar uma classe Dirigivel" },
      { label: "Guardar nome e altitude" },
      { label: "Criar dois dirigíveis" },
      { label: "Mostrar os dados dos dois dirigíveis" },
    ],
    validate: (output) =>
      output.trim() ===
      "Águia - 100\nFalcão - 200",
    hints: {
      error: "Usa dois atributos: nome e altitude.",
      success: "A frota está pronta para levantar voo 🚀",
    },
  },

  {
    titulo: "Boss Final – O Dragão Ancestral",
    initialCode: "# Junta tudo o que aprendeste\n",
    objectives: [
      { label: "Criar uma classe Dragao" },
      { label: "Guardar nome e vida no __init__" },
      { label: "Criar um método apresentar()" },
      { label: "Criar o dragão Ignis com 500 de vida" },
      { label: "Mostrar: Ignis tem 500 de vida" },
      { label: "Mostrar: Ignis lançou fogo!" },
    ],
    validate: (output) =>
      output.trim() ===
      "Ignis tem 500 de vida\nIgnis lançou fogo!",
    hints: {
      error: "Usa atributos e um método que utilize self.nome.",
      success: "🏆 Derrotaste o Dragão Ancestral e dominaste a POO!",
    },
  },
];

export default dsf_8;