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
           rounded-full px-7 py-4 text-sm font-bold text-white mt-4
           transition-transform duration-200 hover:scale-105 active:scale-95
           bg-center bg-no-repeat
          "
            style={{
              backgroundImage: `url(${BgOptions})`,
              backgroundSize: "60%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",

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