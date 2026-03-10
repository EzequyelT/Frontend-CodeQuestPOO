export default function Modal({
  isOpen = false,
  onClose,
  title = "Título da Modal",
  content = null,
  actions = [],
  width = "400px",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fadeIn">
      
      <div
        className="bg-[#151414] rounded-xl border border-gray-800 shadow-lg p-6 relative animate-scaleUp"
        style={{ width }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-white font-bold text-lg mb-4">{title}</h2>

        <div className="text-gray-300 text-sm mb-5">
          {content}
        </div>

        <div className="flex justify-end gap-2 flex-wrap">
          {actions.map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${
                btn.color === "yellow"
                  ? "bg-yellow-500 text-black hover:bg-yellow-400"
                  : btn.color === "red"
                  ? "bg-red-500 text-white hover:bg-red-400"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}