export default function Objectives({ items = [] }) {
  return (
    <div className="px-4 py-5 bg-gray-800 border-t border-gray-800 rounded-4xl border-4 ">
      
      <p className="text-xs text-gray-500 font-mono mb-2 border-b-2 border-white uppercase tracking-wider">
        Objetivos da fase
      </p>

      <div className="flex flex-col gap-2 mt-4 animate-pulse">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">

            {/* checkbox visual */}
            <span
              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border
              ${
                item.done
                  ? "bg-green-800/60 border-green-600 text-green-400"
                  : "bg-gray-800 border-gray-700 text-gray-600"
              }`}
            >
              {item.done ? "✓" : ""}
            </span>

            {/* texto */}
            <span
              className={`text-xs font-mono ${
                item.done ? "text-gray-500 line-through" : "text-gray-300"
              }`}
            >
              {item.label}
            </span>

          </div>
        ))}
      </div>
    </div>
  )
}