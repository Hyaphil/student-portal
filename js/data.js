// Fictional sample data — no real student information.
const PORTAL_DATA = {
  student: {
    firstName: "Alex",
    lastName: "Rivera",
    studentId: "2024-00123",
    program: "BS Computer Science",
    yearLevel: "2nd Year",
    status: "Regular",
    email: "alex.rivera@student.example.edu",
    phone: "+1 555 0142",
    birthday: "2005-04-18",
    address: "123 Maple Street, Springfield",
    advisor: "Dr. Jordan Lee",
    attendance: 96,
    unitsEarned: 48,
  },

  schedule: [
    { day: "Monday", code: "CS201", title: "Data Structures", time: "08:00 - 09:30", room: "Room 301", instructor: "Prof. Kim", color: "#6366f1" },
    { day: "Monday", code: "MATH210", title: "Discrete Mathematics", time: "10:00 - 11:30", room: "Room 204", instructor: "Prof. Santos", color: "#0ea5e9" },
    { day: "Monday", code: "ENG102", title: "Technical Writing", time: "13:00 - 14:30", room: "Room 110", instructor: "Prof. Brown", color: "#f59e0b" },
    { day: "Tuesday", code: "CS205", title: "Web Development", time: "09:00 - 11:00", room: "Lab 2", instructor: "Prof. Garcia", color: "#10b981" },
    { day: "Tuesday", code: "PE102", title: "Physical Education", time: "14:00 - 16:00", room: "Gym", instructor: "Coach Taylor", color: "#ef4444" },
    { day: "Wednesday", code: "CS201", title: "Data Structures", time: "08:00 - 09:30", room: "Room 301", instructor: "Prof. Kim", color: "#6366f1" },
    { day: "Wednesday", code: "MATH210", title: "Discrete Mathematics", time: "10:00 - 11:30", room: "Room 204", instructor: "Prof. Santos", color: "#0ea5e9" },
    { day: "Wednesday", code: "HIST101", title: "World History", time: "15:00 - 16:30", room: "Room 115", instructor: "Prof. Adams", color: "#8b5cf6" },
    { day: "Thursday", code: "CS205", title: "Web Development", time: "09:00 - 11:00", room: "Lab 2", instructor: "Prof. Garcia", color: "#10b981" },
    { day: "Thursday", code: "ENG102", title: "Technical Writing", time: "13:00 - 14:30", room: "Room 110", instructor: "Prof. Brown", color: "#f59e0b" },
    { day: "Friday", code: "CS210", title: "Database Systems", time: "08:30 - 11:30", room: "Lab 4", instructor: "Prof. Nguyen", color: "#ec4899" },
    { day: "Friday", code: "HIST101", title: "World History", time: "13:00 - 14:30", room: "Room 115", instructor: "Prof. Adams", color: "#8b5cf6" },
  ],

  grades: {
    "1st Semester 2025-2026": [
      { code: "CS201", title: "Data Structures", units: 3, midterm: 91, finals: 94 },
      { code: "CS205", title: "Web Development", units: 3, midterm: 95, finals: 97 },
      { code: "CS210", title: "Database Systems", units: 3, midterm: 88, finals: 90 },
      { code: "MATH210", title: "Discrete Mathematics", units: 3, midterm: 84, finals: 87 },
      { code: "ENG102", title: "Technical Writing", units: 3, midterm: 90, finals: 92 },
      { code: "HIST101", title: "World History", units: 3, midterm: 86, finals: 89 },
      { code: "PE102", title: "Physical Education", units: 2, midterm: 96, finals: 98 },
    ],
    "2nd Semester 2024-2025": [
      { code: "CS102", title: "Programming II", units: 3, midterm: 89, finals: 93 },
      { code: "MATH102", title: "Calculus I", units: 3, midterm: 80, finals: 85 },
      { code: "ENG101", title: "Communication Skills", units: 3, midterm: 92, finals: 94 },
      { code: "PHYS101", title: "General Physics", units: 4, midterm: 82, finals: 86 },
      { code: "PE101", title: "Physical Fitness", units: 2, midterm: 95, finals: 97 },
    ],
    "1st Semester 2024-2025": [
      { code: "CS101", title: "Programming I", units: 3, midterm: 90, finals: 92 },
      { code: "MATH101", title: "College Algebra", units: 3, midterm: 85, finals: 88 },
      { code: "IT101", title: "Intro to Computing", units: 3, midterm: 94, finals: 96 },
      { code: "SOC101", title: "Understanding the Self", units: 3, midterm: 88, finals: 91 },
    ],
  },

  announcements: [
    { id: 1, title: "Final Examination Schedule Released", category: "Academic", date: "2026-11-24", author: "Registrar's Office", body: "The final examination schedule for the 1st Semester is now available. Please check your class schedule and prepare accordingly. Exams begin December 8." },
    { id: 2, title: "Campus Tech Fair 2026", category: "Event", date: "2026-11-21", author: "Student Council", body: "Join us at the Main Hall for the annual Tech Fair featuring student projects, workshops, and guest speakers from the industry. Free entry for all students." },
    { id: 3, title: "Tuition Payment Deadline", category: "Finance", date: "2026-11-18", author: "Accounting Office", body: "Reminder: the last day to settle your remaining balance for this semester is November 30. Payments can be made online or at the cashier." },
    { id: 4, title: "Library Extended Hours", category: "General", date: "2026-11-15", author: "University Library", body: "The library will be open until 10:00 PM from November 25 to December 12 to support students during the exam period." },
    { id: 5, title: "Enrollment for 2nd Semester", category: "Academic", date: "2026-11-10", author: "Registrar's Office", body: "Pre-enrollment for the 2nd Semester opens on January 5. Consult your academic advisor before selecting your subjects." },
    { id: 6, title: "Holiday Break Announcement", category: "General", date: "2026-11-05", author: "Office of the President", body: "Classes will be suspended from December 20 to January 3 for the holiday break. Have a safe and happy holiday season!" },
  ],
};
