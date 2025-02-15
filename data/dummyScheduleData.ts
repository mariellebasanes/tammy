export interface Class {
  id: string
  subject: string
  courseCode: string
  professor: string
  room: string
  time: string
  days: string
  mode: string
}

export interface Schedule {
  id: string
  classes: Array<{
    id: string
    subject: string
    courseCode: string
    professor: string
    room: string
    time: string
    days: string
    mode: string
  }>
  fitness: number
}

export const dummySchedules: Schedule[] = [
  {
    id: "schedule1",
    fitness: 0.95,
    classes: [
      {
        id: "class1",
        subject: "Introduction to Computer Science",
        courseCode: "CS101",
        professor: "Dr. Alan Turing",
        room: "CS Lab 1",
        time: "09:00 AM - 10:30 AM",
        days: "MWF",
        mode: "in-person",
      },
      {
        id: "class2",
        subject: "Calculus I",
        courseCode: "MATH201",
        professor: "Dr. Katherine Johnson",
        room: "Math Hall 101",
        time: "11:00 AM - 12:30 PM",
        days: "MWF",
        mode: "in-person",
      },
      {
        id: "class3",
        subject: "Introduction to Psychology",
        courseCode: "PSYCH101",
        professor: "Dr. Sigmund Freud",
        room: "Online",
        time: "02:00 PM - 03:30 PM",
        days: "TTH",
        mode: "online",
      },
      {
        id: "class4",
        subject: "English Composition",
        courseCode: "ENG101",
        professor: "Prof. William Shakespeare",
        room: "Liberal Arts 305",
        time: "10:00 AM - 11:30 AM",
        days: "TTH",
        mode: "in-person",
      },
    ],
  },
  {
    id: "schedule2",
    fitness: 0.92,
    classes: [
      {
        id: "class5",
        subject: "Data Structures and Algorithms",
        courseCode: "CS201",
        professor: "Dr. Ada Lovelace",
        room: "Online",
        time: "10:00 AM - 11:30 AM",
        days: "MWF",
        mode: "online",
      },
      {
        id: "class6",
        subject: "Physics I",
        courseCode: "PHYS101",
        professor: "Dr. Albert Einstein",
        room: "Physics Hall 101",
        time: "01:00 PM - 02:30 PM",
        days: "MWF",
        mode: "in-person",
      },
      {
        id: "class7",
        subject: "World History",
        courseCode: "HIST101",
        professor: "Dr. Howard Zinn",
        room: "History Building 202",
        time: "11:00 AM - 12:30 PM",
        days: "TTH",
        mode: "in-person",
      },
      {
        id: "class8",
        subject: "Introduction to Philosophy",
        courseCode: "PHIL101",
        professor: "Dr. Simone de Beauvoir",
        room: "Online",
        time: "03:00 PM - 04:30 PM",
        days: "TTH",
        mode: "online",
      },
    ],
  },
  {
    id: "schedule3",
    fitness: 0.88,
    classes: [
      {
        id: "class9",
        subject: "Artificial Intelligence",
        courseCode: "CS301",
        professor: "Dr. Geoffrey Hinton",
        room: "Online",
        time: "09:00 AM - 10:30 AM",
        days: "TTH",
        mode: "online",
      },
      {
        id: "class10",
        subject: "Linear Algebra",
        courseCode: "MATH301",
        professor: "Dr. Emmy Noether",
        room: "Math Hall 201",
        time: "11:00 AM - 12:30 PM",
        days: "MWF",
        mode: "in-person",
      },
      {
        id: "class11",
        subject: "Organic Chemistry",
        courseCode: "CHEM201",
        professor: "Dr. Rosalind Franklin",
        room: "Chemistry Lab 101",
        time: "02:00 PM - 03:30 PM",
        days: "MWF",
        mode: "in-person",
      },
      {
        id: "class12",
        subject: "Microeconomics",
        courseCode: "ECON101",
        professor: "Dr. Adam Smith",
        room: "Online",
        time: "10:00 AM - 11:30 AM",
        days: "TTH",
        mode: "online",
      },
    ],
  },
]

