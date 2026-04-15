import { useEffect, useRef } from "react"

export default function ConsoleBox({ logs = [], loading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-400"
      case "error":
        return "text-red-400"
      case "warn":
        return "text-yellow-400"
      default:
        return "text-gray-300"
    }
  }

  return (
    <div className="bg-black border scrollbar border-gray-800 rounded-4xl p-4 h-30 w-100 overflow-y-auto font-mono text-xs relative">

      <p className="text-gray-500 font-bold mb-2">
        🖥 Console
      </p>

      {logs.length === 0 && !loading && (
        <p className="text-gray-600">
          Aguardando execução...
        </p>
      )}

      {/* 🔥 LOADING STATE */}
      {loading && (
        <p className="text-yellow-400 animate-pulse">
          🐍 Inicializando Python...
        </p>
      )}

      {logs.map((log, i) => (
        <div key={i} className={`${getColor(log.type)} mb-1`}>
          <span className="text-gray-600">
            [{log.time}]
          </span>{" "}
          {log.message}
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  )
}