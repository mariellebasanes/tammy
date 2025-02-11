import random as rnd
import json

POPULATION_SIZE = 5
NUMB_OF_ELITE_SCHEDULES = 2
TOURNAMENT_SELECTION_SIZE = 3
MUTATION_RATE = 0.1
MAX_GENERATIONS = 100

class Data:
    ROOMS = [["R1", 30], ["R2", 40], ["R3", 50]]
    MEETING_TIMES = [
        ["MT1", "MWF 09:00 - 10:00"],
        ["MT2", "MWF 10:00 - 11:00"],
        ["MT3", "TTH 09:00 - 10:30"],
        ["MT4", "TTH 10:30 - 12:00"]
    ]
    COURSES = [
        ["CS0053", "CS ELECTIVE", 30],
        ["CS0011", "MOBILE PROGRAMMING", 40],
        ["CS0019", "MOD SIM", 30],
        ["CS0025", "SOFTWARE ENGINEERING", 50]
    ]

    def __init__(self):
        self._rooms = [Room(room[0], room[1]) for room in self.ROOMS]
        self._meetingTimes = [MeetingTime(mt[0], mt[1]) for mt in self.MEETING_TIMES]
        self._courses = [Course(course[0], course[1], course[2]) for course in self.COURSES]
        self._depts = [Department("CS", self._courses)]
        self._numberOfClasses = sum(len(dept.get_courses()) for dept in self._depts)

    def get_rooms(self): return self._rooms
    def get_meetingTimes(self): return self._meetingTimes
    def get_courses(self): return self._courses
    def get_depts(self): return self._depts
    def get_numberOfClasses(self): return self._numberOfClasses

# [Previous class definitions for Room, MeetingTime, Course, Department, Class remain the same]

class Schedule:
    def __init__(self, data):
        self._data = data
        self._classes = []
        self._conflicts = 0
        self._fitness = -1
        self._classNumb = 0
        self._isFitnessChanged = True

    def initialize(self):
        depts = self._data.get_depts()
        for i in range(len(depts)):
            courses = depts[i].get_courses()
            for j in range(len(courses)):
                newClass = Class(self._classNumb, depts[i], courses[j])
                self._classNumb += 1
                newClass.set_meetingTime(data.get_meetingTimes()[rnd.randrange(0, len(data.get_meetingTimes()))])
                newClass.set_room(data.get_rooms()[rnd.randrange(0, len(data.get_rooms()))])
                self._classes.append(newClass)
        return self

    def to_dict(self):
        return {
            'classes': [{
                'course': cls.get_course().get_name(),
                'room': cls.get_room().get_number(),
                'time': cls.get_meetingTime().get_time(),
                'fitness': self.get_fitness()
            } for cls in self._classes]
        }

# [Previous GeneticAlgorithm class implementation remains the same]

def generate_schedules(preferences):
    data = Data()
    ga = GeneticAlgorithm()
    population = Population(POPULATION_SIZE)
    generation = 0
    best_schedules = []

    while generation < MAX_GENERATIONS:
        population.get_schedules().sort(key=lambda x: x.get_fitness(), reverse=True)
        best_schedule = population.get_schedules()[0]
        
        if best_schedule.get_fitness() >= 0.9:  # Consider schedules with fitness >= 0.9
            best_schedules.append(best_schedule.to_dict())
            if len(best_schedules) >= 3:  # Get top 3 schedules
                break
        
        if best_schedule.get_fitness() == 1.0:
            break
            
        population = ga.evolve(population)
        generation += 1

    return json.dumps(best_schedules)

if __name__ == "__main__":
    preferences = {
        "preferred_times": ["morning"],
        "preferred_days": ["MWF"]
    }
    print(generate_schedules(preferences))

