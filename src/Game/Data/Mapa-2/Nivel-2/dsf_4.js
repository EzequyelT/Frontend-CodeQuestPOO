const dsf_4 = [
  {
    titulo: "Fase 1 – Nome do Habitante",
    initialCode: "# Usa __init__ para guardar o nome de um habitante\n",
    objectives: [
      { label: "Criar uma classe chamada Habitante" },
      { label: "Criar o método __init__ com o parâmetro nome" },
      { label: "Guardar o nome em self.nome" },
      { label: "Criar um objeto com o nome Ana" },
      { label: "Mostrar o nome Ana" },
    ],
    validate: (output) => output.trim() === "Ana",
    hints: {
      error: "Dentro do __init__, usa self.nome = nome. Depois imprime aldeao.nome.",
      success: "Boa! O habitante já guarda o próprio nome 🎉",
    },
  },
  {
    titulo: "Fase 2 – Casa com Cor",
    initialCode: "# Cria uma casa com uma cor usando __init__\n",
    objectives: [
      { label: "Criar uma classe chamada Casa" },
      { label: "Criar __init__ com o parâmetro cor" },
      { label: "Guardar a cor em self.cor" },
      { label: "Criar uma casa com a cor azul" },
      { label: "Mostrar azul" },
    ],
    validate: (output) => output.trim() === "azul",
    hints: {
      error: "A cor deve ser guardada com self.cor = cor.",
      success: "Muito bem! A casa azul foi construída 🏠",
    },
  },
  {
    titulo: "Fase 3 – Lobo com Vida",
    initialCode: "# Cria o Lobo Guardião com vida inicial\n",
    objectives: [
      { label: "Criar uma classe chamada Lobo" },
      { label: "Criar __init__ com o parâmetro vida" },
      { label: "Guardar a vida em self.vida" },
      { label: "Criar o lobo com 100 de vida" },
      { label: "Mostrar 100" },
    ],
    validate: (output) => output.trim() === "100",
    hints: {
      error: "Cria o objeto com boss = Lobo(100) e mostra boss.vida.",
      success: "Boa! O Lobo Guardião tem vida definida 🐺",
    },
  },
];

export default dsf_4;