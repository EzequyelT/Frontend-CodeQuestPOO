export default function classifyError(rawError) {
    if (!rawError) return null

    const err = String(rawError)

    // --- Sintaxe (id 1) ---
    if (
        err.includes("SyntaxError") ||
        err.includes("IndentationError") ||
        err.includes("TabError")
    ) {
        return 1
    }

    // --- Herança (id 5) ---
    // super() mal usado, MRO, classes base erradas
    if (
        err.includes("super(") ||
        err.includes("MRO") ||
        err.includes("cannot unpack") ||
        err.includes("__bases__")
    ) {
        return 5
    }

    // --- Encapsulamento (id 4) ---
    // Acesso a atributos privados, self mal usado
    if (
        err.includes("AttributeError") ||
        err.includes("'NoneType' object has no attribute") ||
        err.includes("object has no attribute")
    ) {
        return 4
    }

    // --- Polimorfismo (id 6) ---
    // Métodos com assinatura errada, override indevido
    if (
        err.includes("takes") && err.includes("argument") ||
        err.includes("unexpected keyword argument") ||
        err.includes("positional argument")
    ) {
        return 6
    }

    // --- Lógica (id 2) ---
    // Erros de execução: variáveis, tipos, índices, divisão
    if (
        err.includes("NameError") ||
        err.includes("TypeError") ||
        err.includes("ValueError") ||
        err.includes("ZeroDivisionError") ||
        err.includes("IndexError") ||
        err.includes("KeyError") ||
        err.includes("RecursionError") ||
        err.includes("StopIteration")
    ) {
        return 2
    }

    // --- Fallback → Lógica ---
    return 2

}