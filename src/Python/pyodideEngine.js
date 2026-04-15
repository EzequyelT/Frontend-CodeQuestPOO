import { loadPyodide } from "pyodide"

let pyodideInstance = null
let pyodidePromise = null

export async function getPyodide() {
  if (pyodideInstance) return pyodideInstance

  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      pyodideInstance = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/"
      })

      return pyodideInstance
    })()
  }

  return pyodidePromise
}