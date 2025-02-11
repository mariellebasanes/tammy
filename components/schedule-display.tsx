import type { Schedule, Class } from "../data/dummyScheduleData"

interface ScheduleDisplayProps {
  schedules: Schedule[]
}

export default function ScheduleDisplay({ schedules }: ScheduleDisplayProps) {
  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <div key={schedule.id} className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-[#86C555] text-white">
            <h3 className="text-lg font-semibold">Schedule Option (Fitness: {schedule.fitness.toFixed(2)})</h3>
          </div>
          <div className="p-4">
            {schedule.classes.map((cls: Class) => (
              <div key={cls.id} className="mb-3 p-2 bg-gray-50 rounded">
                <p className="font-semibold">
                  {cls.subject} ({cls.courseCode})
                </p>
                <p>Professor: {cls.professor}</p>
                <p>Room: {cls.room}</p>
                <p>Time: {cls.time}</p>
                <p>Days: {cls.days}</p>
                <p>Mode: {cls.mode}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

