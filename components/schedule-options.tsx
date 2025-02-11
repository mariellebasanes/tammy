interface ScheduleOption {
  id: string
  classes: Array<{
    subject: string
    time: string
    days: string
    professor: string
  }>
}

export default function ScheduleOptions({ options }: { options: ScheduleOption[] }) {
  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <button
          key={option.id}
          className="w-full p-4 bg-[#86C555] text-white rounded-xl hover:bg-[#78B348] transition-colors text-lg font-medium"
        >
          Option {index + 1}
        </button>
      ))}
    </div>
  )
}

