import type React from "react"
import type { Schedule } from "@/data/dummyScheduleData"

interface ScheduleDisplayProps {
  schedule: Schedule
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-[#86C555] text-white">
        <h3 className="text-lg font-semibold">Selected Schedule</h3>
        <p className="text-sm opacity-90">Fitness Score: {schedule.fitness.toFixed(2)}</p>
      </div>
      <div className="p-4 space-y-4">
        {schedule.classes.map((cls) => (
          <div key={cls.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="font-medium text-gray-900">{cls.subject}</h4>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>Course Code: {cls.courseCode}</p>
              <p>Professor: {cls.professor}</p>
              <p>Room: {cls.room}</p>
              <p>Time: {cls.time}</p>
              <p>Days: {cls.days}</p>
              <p>Mode: {cls.mode}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScheduleDisplay

