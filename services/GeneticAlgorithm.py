import random as rnd
import json

POPULATION_SIZE = 5
NUMB_OF_ELITE_SCHEDULES = 2
TOURNAMENT_SELECTION_SIZE = 3
MUTATION_RATE = 0.1
MAX_GENERATIONS = 100

class Room:
    def __init__(self, number, capacity):
        self.number = number
        self.capacity = capacity

    def get_number(self):
        return self.number

class MeetingTime:
    def __init__(self, id, time):
        self.id = id
        self.time = time

    def get_time(self):
        return self.time

class Course:
    def __init__(self, code, name, capacity):
        self.code = code
        self.name = name
        self.capacity = capacity

    def get_name(self):
        return self.name

class Department:
    def __init__(self, code, courses):
        self.code = code
        self.courses = courses

    def get_courses(self):
        return self.courses

class Class:
    def __init__(self, id, department, course):
        self.id = id
        self.department = department
        self.course = course
        self.meeting_time = None
        self.room = None

    def set_meetingTime(self, meeting_time):
        self.meeting_time = meeting_time

    def set_room(self, room):
        self.room = room

    def get_meetingTime(self):
        return self.meeting_time

    def get_room(self):
        return self.room

    def get_course(self):
        return self.course

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

class GeneticAlgorithm:
    # Implement the genetic algorithm logic here
    pass

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
                newClass.set_meetingTime(self._data.get_meetingTimes()[rnd.randrange(0, len(self._data.get_meetingTimes()))])
                newClass.set_room(self._data.get_rooms()[rnd.randrange(0, len(self._data.get_rooms()))])
                self._classes.append(newClass)
        return self

    def get_fitness(self):
        if self._isFitnessChanged:
            self._fitness = self.calculate_fitness()
            self._isFitnessChanged = False
        return self._fitness

    def calculate_fitness(self):
        self._conflicts = 0
        classes = self._classes
        for i in range(len(classes)):
            if classes[i].get_room().get_capacity() < classes[i].get_course().get_capacity():
                self._conflicts += 1
            for j in range(len(classes)):
                if j > i:
                    if (classes[i].get_meetingTime() == classes[j].get_meetingTime() and
                        classes[i].get_room() == classes[j].get_room()):
                        self._conflicts += 1
                    if (classes[i].get_meetingTime() == classes[j].get_meetingTime() and
                        classes[i].get_course() == classes[j].get_course()):
                        self._conflicts += 1
        return 1 / (1.0 * self._conflicts + 1)

    def to_dict(self):
        return {
            'classes': [{
                'course': cls.get_course().get_name(),
                'room': cls.get_room().get_number(),
                'time': cls.get_meetingTime().get_time(),
                'fitness': self.get_fitness()
            } for cls in self._classes]
        }

class Population:
    def __init__(self, size):
        self.schedules = [Schedule(Data()) for _ in range(size)]  # Assuming Schedule takes Data as an argument

    def get_schedules(self):
        return self.schedules

    def evolve(self):
        # Implement your evolution logic here
        pass

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

