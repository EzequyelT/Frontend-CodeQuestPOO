export default function formatError(err) {
  if (!err) return "❌ Erro desconhecido"

  // Converter para string por segurança
  const error = String(err)

  // Erros de nome/variáveis
  if (error.includes("NameError")) {
    return "❌ A variável ou nome utilizado não existe"
  }

  // Erros de sintaxe
  if (error.includes("SyntaxError")) {
    return "❌ Erro de sintaxe no código"
  }

  // Erros de indentação (muito comum em Python)
  if (error.includes("IndentationError")) {
    return "❌ Erro de indentação (espaços/tabs incorretos)"
  }

  // Erros de tipo (ex: somar string com número)
  if (error.includes("TypeError")) {
    return "❌ Tipo de dados inválido para esta operação"
  }

  // Erros de índice (listas/arrays)
  if (error.includes("IndexError")) {
    return "❌ Índice fora dos limites da lista"
  }

  // Erros de valor
  if (error.includes("ValueError")) {
    return "❌ Valor inválido fornecido"
  }

  // Divisão por zero
  if (error.includes("ZeroDivisionError")) {
    return "❌ Não é possível dividir por zero"
  }

  // Importações
  if (error.includes("ImportError") || error.includes("ModuleNotFoundError")) {
    return "❌ Módulo não encontrado ou erro na importação"
  }

  // Fallback: devolver erro original se não for reconhecido
  return `❌ Erro inesperado: ${error}`
}