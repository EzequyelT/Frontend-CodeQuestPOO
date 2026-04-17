export function dsf_5() {
  return [
    {
      titulo: "Fase 1 – Maioridade",
      initialCode: "# Verifica se a pessoa é maior de idade\nidade = 18\n",
      objectives: [
        { label: "Criar uma condição if para idade >= 18" },
        { label: "Se for verdadeiro, mostrar 'Adulto'" },
        { label: "Usar else para mostrar 'Menor'" },
      ],
      validate: (output) => output.trim() === "Adulto",
      hints: {
        error: "Lembra-te: if idade >= 18: e o print deve estar indentado dentro do if",
        success: "Boa! Entendeste o if/else 🎉",
      },
    },
    {
      titulo: "Fase 2 – Número Par ou Ímpar",
      initialCode: "# Verifica se o número é par ou ímpar\nnum = 7\n",
      objectives: [
        { label: "Usar if com num % 2 == 0" },
        { label: "Mostrar 'Par' se for verdadeiro" },
        { label: "Usar else para mostrar 'Ímpar'" },
      ],
      validate: (output) => {
        const value = output.trim().toLowerCase();
        return value === "par" || value === "ímpar";
      },
      hints: {
        error: "Dica: números ímpares dão resto diferente de 0 quando divididos por 2",
        success: "Boa! Sabes identificar pares e ímpares 🎉",
      },
    },
    {
      titulo: "Fase 3 – Nota Escolar",
      initialCode: "# Classificação de nota\nnota = 14\n",
      objectives: [
        { label: "Se nota >= 10, mostrar 'Aprovado'" },
        { label: "Caso contrário, mostrar 'Reprovado'" },
        { label: "Usar if e else corretamente" },
      ],
      validate: (output) => {
        const res = output.trim();
        return res === "Aprovado" || res === "Reprovado";
      },
      hints: {
        error: "Confere a condição: if nota >= 10",
        success: "Boa! Já sabes avaliar notas 🎉",
      },
    },
    {
      titulo: "Fase 4 – Login Simples",
      initialCode: "# Verificação de utilizador\nuser = 'admin'\n",
      objectives: [
        { label: "Se user == 'admin', mostrar 'Bem-vindo'" },
        { label: "Caso contrário, mostrar 'Acesso negado'" },
        { label: "Usar if/else com strings" },
      ],
      validate: (output) => {
        const res = output.trim();
        return res === "Bem-vindo" || res === "Acesso negado";
      },
      hints: {
        error: "Lembra-te de comparar strings com == e usar aspas",
        success: "Perfeito! Já sabes validar utilizadores 🔐",
      },
    },
  ];
}


export default dsf_5;