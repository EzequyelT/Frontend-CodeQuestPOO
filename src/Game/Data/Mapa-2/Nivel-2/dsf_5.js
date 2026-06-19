const dsf_5 = [
  {
    titulo: "Fase 1 – Nome e Idade",
    initialCode: "# Guarda nome e idade num objeto\n",
    objectives: [
      { label: "Criar uma classe chamada Habitante" },
      { label: "Usar __init__ com nome e idade" },
      { label: "Guardar os valores em self.nome e self.idade" },
      { label: "Criar um habitante chamado Rui com 12 anos" },
      { label: "Mostrar: Rui tem 12 anos" },
    ],
    validate: (output) => output.trim() === "Rui tem 12 anos",
    hints: {
      error: "Usa print(habitante.nome, 'tem', habitante.idade, 'anos') ou uma f-string.",
      success: "Excelente! O objeto já tem vários atributos 🎉",
    },
  },
  {
    titulo: "Fase 2 – Ferramenta da Oficina",
    initialCode: "# Cria uma ferramenta com nome e tipo\n",
    objectives: [
      { label: "Criar uma classe chamada Ferramenta" },
      { label: "Guardar nome e tipo no __init__" },
      { label: "Criar uma ferramenta chamada Martelo do tipo construção" },
      { label: "Mostrar: Martelo - construção" },
    ],
    validate: (output) => output.trim() === "Martelo - construção",
    hints: {
      error: "Guarda os atributos com self.nome e self.tipo.",
      success: "Boa! A oficina recebeu uma ferramenta nova 🔨",
    },
  },
  {
    titulo: "Fase 3 – Armadura do Lobo",
    initialCode: "# Guarda os atributos do Lobo de Armadura Negra\n",
    objectives: [
      { label: "Criar uma classe chamada Lobo" },
      { label: "Guardar nome e armadura no __init__" },
      { label: "Criar o lobo com nome Fenrir e armadura negra" },
      { label: "Mostrar: Fenrir usa armadura negra" },
    ],
    validate: (output) => output.trim() === "Fenrir usa armadura negra",
    hints: {
      error: "Usa dois atributos: self.nome e self.armadura.",
      success: "Muito bem! O boss já tem identidade e armadura 🐺",
    },
  },
];

export default dsf_5;