export default function AnswerOptions({
  options = [],
  onDragStart,
  className = "",
}) {
  return (
    <div
      className={`
  rounded-3xl flex p-4 mt-4
  border-t-[3px] border-t-white top-border-glow
  animate-pulse
  w-[750px] h-auto
  ${className}
`}

    >
      <div className="flex flex-wrap gap-3 items-center justify-center flex-row">
        {options.map((item) => (
          <button
            key={item.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/json", JSON.stringify(item));
              onDragStart?.(item, e);
            }}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(180deg, #2d1654 0%, #1e0f3d 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}