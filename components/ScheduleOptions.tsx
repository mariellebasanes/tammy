import type React from "react"
import type { Schedule } from "@/data/dummyScheduleData"

interface ScheduleOptionsProps {
  options: Schedule[]
  onSelect: (schedule: Schedule) => void
}

const ScheduleOptions: React.FC<ScheduleOptionsProps> = ({ options, onSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Schedule Options:</h3>
      {options.map((schedule, index) => (
        <div
          key={schedule.id || index}
          onClick={() => {
            console.log("Clicking schedule:", schedule)
            onSelect(schedule)
          }}
          className="w-full p-4 bg-[#86C555] hover:bg-[#78B348] text-white rounded-xl transition-colors cursor-pointer active:bg-[#6BA33D] transform active:scale-[0.99]"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSelect(schedule)
            }
          }}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">Option {index + 1}</h4>
            <span className="text-sm bg-white/20 px-2 py-1 rounded">Click to view</span>
          </div>
          <div className="mt-2 text-sm">
            <p>{schedule.classes?.length || 0} Classes</p>
            <p>Fitness Score: {schedule.fitness?.toFixed(2) || "N/A"}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ScheduleOptions

