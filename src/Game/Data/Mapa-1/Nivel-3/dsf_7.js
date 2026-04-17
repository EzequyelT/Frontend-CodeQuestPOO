const dsf_7 = [
  {
    type: "quiz",
    titulo: "Debug 1 – Aspas",
    texto: "O que está errado?\n\nprint('Olá)",
    opcoes: [
      { id: "a", label: "Falta fechar aspas" },
      { id: "b", label: "Falta dois pontos" },
      { id: "c", label: "Indentação errada" },
      { id: "d", label: "Nada está errado" },
    ],
    correctId: "a",
  },

  {
    type: "quiz",
    titulo: "Debug 2 – Comparação",
    texto: "Qual é a correção correta?\n\nif x = 10:",
    opcoes: [
      { id: "a", label: "if x == 10:" },
      { id: "b", label: "if x === 10:" },
      { id: "c", label: "if (x = 10):" },
      { id: "d", label: "if x := 10:" },
    ],
    correctId: "a",
  },

  {
    type: "quiz",
    titulo: "Debug 3 – Loop",
    texto: "O que falta neste código?\n\nfor i in range(3)\n    print(i)",
    opcoes: [
      { id: "a", label: "Falta :" },
      { id: "b", label: "range está errado" },
      { id: "c", label: "print está errado" },
      { id: "d", label: "Nada está errado" },
    ],
    correctId: "a",
  },

  // _____________________________________________________________________________________
  {
    type: "code",
    titulo: "Corrigir Código – If",
    initialCode: "x = 5\nif x = 5:\n    print('OK')",
    objectives: [
      { label: "Corrigir o erro na condição" },
      { label: "Fazer o código funcionar" },
      { label: "Mostrar OK no output" },
    ],
    validate: (output) => output.trim() === "OK",
    hints: {
      error: "Dica: para comparar usa == e não =",
      success: "Boa! Corrigiste o if 🎉"
    }
  },

  {
    type: "code",
    titulo: "Corrigir Código – Loop",
    initialCode: "for i in range(3)\nprint(i)",
    objectives: [
      { label: "Corrigir o erro no for" },
      { label: "Corrigir a indentação" },
      { label: "Mostrar 0, 1 e 2" },
    ],
    validate: (output) =>
      output.includes("0") &&
      output.includes("1") &&
      output.includes("2"),
    hints: {
      error: "Falta algo no for e atenção à indentação",
      success: "Boa! Loop corrigido 🎉"
    }
  }
]

export default dsf_7