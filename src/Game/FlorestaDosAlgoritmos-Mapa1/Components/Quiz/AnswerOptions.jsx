import BgOptions from "../../../../assets/Buttons/BgOptions.png"

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
            className="
            rounded-full text-sm font-bold text-white mt-1 ml-5
            transition-transform duration-200 hover:scale-105 active:scale-95
            "
            style={{
              backgroundImage: `url(${BgOptions})`,
              backgroundSize: "100% 100%",   // ✅ stretches to fill the whole button
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              padding: "18px 35px",          // ✅ bigger padding = bigger button = bigger bg
              minWidth: "140px",             // ✅ prevents very short labels from collapsing
            }}
            key={item.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/json", JSON.stringify(item));
              onDragStart?.(item, e);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}