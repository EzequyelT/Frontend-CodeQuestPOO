export default function MentorBox({
  status = "idle",
  messages = {},
}) {

  const defaultMessages = {
    idle: "Vamos começar!",
    typing: "Estou a ver...",
    error: "Algo não está certo...",
    success: "Boa!",
  }

  const mergedMessages = {
    ...defaultMessages,
    ...messages,
  }

  const styles = {
    idle: "text-gray-400",
    typing: "text-blue-400",
    error: "text-yellow-400",
    success: "text-green-400",
  }

  const emojis = {
    idle: "👤",
    typing: "🤔",
    error: "😐",
    success: "😄",
  }

  return (
    <div className="px-4 py-4 bg-gray-900 border border-gray-800 rounded-xl">

      <div className="flex items-center gap-2 mb-3">
        <span>{emojis[status]}</span>
        <p className="text-xs uppercase text-gray-500 font-mono">
          Mentor
        </p>
      </div>

      <p className={`text-sm font-mono ${styles[status]}`}>
        {mergedMessages[status]}
      </p>

    </div>
  )
}