export default function formatError(err) {
  if (!err) return "❌ Erro desconhecido"

  const error = String(err)

  if (error.includes("NameError")) {
    return "❌ A variável ou nome utilizado não existe"
  }

  if (error.includes("SyntaxError")) {
    return "❌ Erro de sintaxe no código"
  }

  if (error.includes("IndentationError")) {
    return "❌ Erro de indentação (espaços/tabs incorretos)"
  }

  if (error.includes("TypeError")) {
    return "❌ Tipo de dados inválido para esta operação"
  }

  if (error.includes("IndexError")) {
    return "❌ Índice fora dos limites da lista"
  }

  if (error.includes("ValueError")) {
    return "❌ Valor inválido fornecido"
  }

  if (error.includes("ZeroDivisionError")) {
    return "❌ Não é possível dividir por zero"
  }

  if (error.includes("ImportError") || error.includes("ModuleNotFoundError")) {
    return "❌ Módulo não encontrado ou erro na importação"
  }

  if (error.includes("AttributeError")) {
    return "❌ Tentaste aceder a um atributo ou método que não existe no objeto"
  }

  if (error.includes("super(") || error.includes("MRO")) {
    return "❌ Erro na herança entre classes"
  }

  if (error.includes("positional argument") || error.includes("unexpected keyword argument")) {
    return "❌ Número ou tipo de argumentos incorreto no método"
  }

  return `❌ Erro inesperado: ${error}`
}