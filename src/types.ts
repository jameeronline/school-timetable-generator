export type Day = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export const DAYS: Day[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const COMMON_SUBJECTS = [
  'Arabic', 'Art', 'Business Studies', 'Chemistry', 'Computer Science',
  'Economics', 'English', 'Environment Studies', 'French', 'Geography',
  'Hindi', 'History', 'Islamic Studies', 'Kannada', 'Malayalam',
  'Mathematics', 'Moral Stories', 'Music', 'Physical Education', 'Physics',
  'Quran', 'Science', 'Social Science', 'Spanish', 'Tamil', 'Telungu', 'Urdu',
] as const;

export interface SchoolInfo {
  name: string;
  logo: string | null;
  address: string;
}

export interface StudentInfo {
  name: string;
  class: string;
  section: string;
  academicYear: string;
}

export interface ScheduleConfig {
  weekDaysStart: Day;
  weekDaysEnd: Day;
  periodsCount: number;
  startTime: string;
  periodDuration: number;
  breakAfterPeriod: number;
  breakDuration: number;
}

export interface TimetableSlot {
  day: Day;
  period: number;
  subject: string;
  isBreak: boolean;
}

export interface PrintConfig {
  preparedBy: string;
}

export interface SavedTimetable {
  id: string;
  name: string;
  createdAt: string;
  schoolInfo: SchoolInfo;
  studentInfo: StudentInfo;
  scheduleConfig: ScheduleConfig;
  slots: TimetableSlot[];
  printConfig: PrintConfig;
}

export interface AppState {
  step: number;
  savedTimetables: SavedTimetable[];
  schoolInfo: SchoolInfo;
  studentInfo: StudentInfo;
  scheduleConfig: ScheduleConfig;
  slots: TimetableSlot[];
  printConfig: PrintConfig;
  
  setStep: (step: number) => void;
  setSavedTimetables: (saved: SavedTimetable[]) => void;
  saveTimetable: (name: string) => string;
  loadTimetable: (id: string) => void;
  deleteTimetable: (id: string) => void;
  exportTimetable: () => string;
  importTimetable: (json: string) => boolean;
  setSchoolInfo: (info: Partial<SchoolInfo>) => void;
  setStudentInfo: (info: Partial<StudentInfo>) => void;
  setScheduleConfig: (config: Partial<ScheduleConfig>) => void;
  setSlot: (day: Day, period: number, subject: string, isBreak?: boolean) => void;
  setPrintConfig: (config: Partial<PrintConfig>) => void;
  initializeSlots: () => void;
  reset: () => void;
}