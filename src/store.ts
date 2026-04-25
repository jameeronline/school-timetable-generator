import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Day, AppState, SavedTimetable } from './types';
import { DAYS, COMMON_SUBJECTS } from './types';

const defaultSchoolInfo = {
  name: '',
  logo: null,
  address: '',
};

const defaultStudentInfo = {
  name: '',
  class: '',
  section: '',
  academicYear: '',
};

const defaultScheduleConfig = {
  weekDaysStart: 'Sunday' as Day,
  weekDaysEnd: 'Thursday' as Day,
  periodsCount: 8,
  startTime: '08:00',
  periodDuration: 45,
  breakAfterPeriod: 4,
  breakDuration: 15,
};

const defaultPrintConfig = {
  preparedBy: '',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      step: 1,
      savedTimetables: [],
      schoolInfo: defaultSchoolInfo,
      studentInfo: defaultStudentInfo,
      scheduleConfig: defaultScheduleConfig,
      slots: [],
      printConfig: defaultPrintConfig,

      setStep: (step) => set({ step }),
      setSavedTimetables: (saved: SavedTimetable[]) => set({ savedTimetables: saved }),
      
      saveTimetable: (name: string) => {
        const { schoolInfo, studentInfo, scheduleConfig, slots, printConfig, savedTimetables } = get();
        const newTimetable: SavedTimetable = {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date().toISOString(),
          schoolInfo,
          studentInfo,
          scheduleConfig,
          slots,
          printConfig,
        };
        const updated = [newTimetable, ...savedTimetables];
        set({ savedTimetables: updated });
        return newTimetable.id;
      },

      loadTimetable: (id: string) => {
        const { savedTimetables } = get();
        const timetable = savedTimetables.find(t => t.id === id);
        if (timetable) {
          set({
            schoolInfo: timetable.schoolInfo,
            studentInfo: timetable.studentInfo,
            scheduleConfig: timetable.scheduleConfig,
            slots: timetable.slots,
            printConfig: timetable.printConfig,
            step: 1,
          });
        }
      },

      deleteTimetable: (id: string) => {
        const { savedTimetables } = get();
        set({ savedTimetables: savedTimetables.filter(t => t.id !== id) });
      },

      exportTimetable: () => {
        const { schoolInfo, studentInfo, scheduleConfig, slots, printConfig } = get();
        return JSON.stringify({
          schoolInfo,
          studentInfo,
          scheduleConfig,
          slots,
          printConfig,
          exportedAt: new Date().toISOString(),
        }, null, 2);
      },

      importTimetable: (jsonString: string) => {
        try {
          const data = JSON.parse(jsonString);
          if (data.schoolInfo && data.scheduleConfig && data.slots) {
            set({
              schoolInfo: data.schoolInfo,
              studentInfo: data.studentInfo || defaultStudentInfo,
              scheduleConfig: data.scheduleConfig,
              slots: data.slots,
              printConfig: data.printConfig || defaultPrintConfig,
              step: 1,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      setSchoolInfo: (info) =>
        set((state) => ({ schoolInfo: { ...state.schoolInfo, ...info } })),

      setStudentInfo: (info) =>
        set((state) => ({ studentInfo: { ...state.studentInfo, ...info } })),

      setScheduleConfig: (config) =>
        set((state) => ({ scheduleConfig: { ...state.scheduleConfig, ...config } })),

      setSlot: (day, period, subject, isBreak = false) =>
        set((state) => {
          const newSlots = state.slots.filter(
            (s) => !(s.day === day && s.period === period)
          );
          newSlots.push({ day, period, subject, isBreak });
          return { slots: newSlots };
        }),

      setPrintConfig: (config) =>
        set((state) => ({ printConfig: { ...state.printConfig, ...config } })),

      initializeSlots: () => {
        const { scheduleConfig } = get();
        const { weekDaysStart, weekDaysEnd, periodsCount, breakAfterPeriod } = scheduleConfig;
        
        const startIndex = DAYS.indexOf(weekDaysStart);
        const endIndex = DAYS.indexOf(weekDaysEnd);
        const activeDays = DAYS.slice(startIndex, endIndex + 1);
        
        const newSlots: { day: Day; period: number; subject: string; isBreak: boolean }[] = [];
        
        activeDays.forEach((day) => {
          for (let p = 1; p <= periodsCount; p++) {
            const isBreak = p === breakAfterPeriod;
            newSlots.push({
              day,
              period: p,
              subject: isBreak ? '' : '',
              isBreak,
            });
          }
        });
        
        set({ slots: newSlots });
      },

      reset: () =>
        set({
          step: 1,
          schoolInfo: defaultSchoolInfo,
          studentInfo: defaultStudentInfo,
          scheduleConfig: defaultScheduleConfig,
          slots: [],
          printConfig: defaultPrintConfig,
        }),
    }),
    {
      name: 'timetable-storage',
      partialize: (state) => ({
        savedTimetables: state.savedTimetables,
        schoolInfo: state.schoolInfo,
        studentInfo: state.studentInfo,
        scheduleConfig: state.scheduleConfig,
        slots: state.slots,
        printConfig: state.printConfig,
      }),
    }
  )
);

export const getActiveDays = (config: typeof defaultScheduleConfig): Day[] => {
  const startIndex = DAYS.indexOf(config.weekDaysStart);
  const endIndex = DAYS.indexOf(config.weekDaysEnd);
  return DAYS.slice(startIndex, endIndex + 1);
};

export const calculateTime = (
  period: number,
  config: typeof defaultScheduleConfig
): string => {
  const { startTime, periodDuration, breakDuration, breakAfterPeriod } = config;
  const [hours, mins] = startTime.split(':').map(Number);
  
  let totalMinutes = hours * 60 + mins;
  
  for (let p = 1; p <= period; p++) {
    if (p < period) {
      if (p === breakAfterPeriod) {
        totalMinutes += breakDuration;
      }
      totalMinutes += periodDuration;
    }
  }
  
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;
  
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
};

export const getTimeForPeriod = (
  period: number,
  config: typeof defaultScheduleConfig
): string => {
  const { startTime, periodDuration, breakDuration, breakAfterPeriod } = config;
  const [hours, mins] = startTime.split(':').map(Number);
  
  let startMinutes = hours * 60 + mins;
  
  for (let p = 1; p < period; p++) {
    if (p === breakAfterPeriod) {
      startMinutes += breakDuration;
    }
    startMinutes += periodDuration;
  }
  
  const endMinutes = startMinutes + periodDuration;
  
  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };
  
  return `${formatTime(startMinutes)} - ${formatTime(endMinutes)}`;
};

export { COMMON_SUBJECTS };