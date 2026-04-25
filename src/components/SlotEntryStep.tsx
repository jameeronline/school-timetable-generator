import { useState } from 'react';
import { useStore, getActiveDays, getTimeForPeriod } from '@/store';
import { type Day } from '@/types';
import { COMMON_SUBJECTS } from '@/types';
import { StepLayout } from './StepLayout';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SlotEntryStep() {
  const { slots, scheduleConfig, setSlot } = useStore();
  const [customSubjects, setCustomSubjects] = useState<Record<string, string>>({});
  const [showCustomInput, setShowCustomInput] = useState<Record<string, boolean>>({});

  const activeDays = getActiveDays(scheduleConfig);
  const breakAfterPeriod = scheduleConfig.breakAfterPeriod;
  const totalColumns = scheduleConfig.periodsCount + (breakAfterPeriod > 0 ? 1 : 0);

  const getSlot = (day: Day, period: number) => {
    return slots.find((s) => s.day === day && s.period === period);
  };

  const handleSubjectChange = (day: Day, period: number, value: string, isBreak: boolean) => {
    if (value === '__custom__') {
      setShowCustomInput((prev) => ({ ...prev, [`${day}-${period}`]: true }));
    } else {
      setSlot(day, period, value, isBreak);
    }
  };

  const handleCustomSubjectSubmit = (day: Day, period: number, value: string, isBreak: boolean) => {
    const key = value.trim();
    if (key) {
      setCustomSubjects((prev) => ({ ...prev, [key]: key }));
    }
    setSlot(day, period, value, isBreak);
    setShowCustomInput((prev) => ({ ...prev, [`${day}-${period}`]: false }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, day: Day, period: number, value: string, isBreak: boolean) => {
    if (e.key === 'Enter') {
      handleCustomSubjectSubmit(day, period, value, isBreak);
    }
  };

  const allSubjects = [...COMMON_SUBJECTS, ...Object.keys(customSubjects)].sort((a, b) => a.localeCompare(b));

  const getColumnLabel = (colIndex: number) => {
    if (breakAfterPeriod > 0 && colIndex === breakAfterPeriod) {
      return 'Break';
    }
    if (colIndex < breakAfterPeriod) {
      return `P${colIndex + 1}`;
    }
    return `P${colIndex}`;
  };

  const getColumnTime = (colIndex: number) => {
    if (breakAfterPeriod > 0 && colIndex === breakAfterPeriod) {
      const { startTime, periodDuration, breakDuration, breakAfterPeriod: bap } = scheduleConfig;
      const [hours, mins] = startTime.split(':').map(Number);
      let startMinutes = hours * 60 + mins;
      for (let p = 1; p < bap; p++) {
        startMinutes += periodDuration;
      }
      startMinutes += periodDuration;
      const endMinutes = startMinutes + breakDuration;
      const formatTime = (m: number) => {
        const h = Math.floor(m / 60) % 24;
        const min = m % 60;
        return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      };
      return `${formatTime(startMinutes)} - ${formatTime(endMinutes)}`;
    }
    if (breakAfterPeriod > 0 && colIndex >= breakAfterPeriod) {
      return getTimeForPeriod(colIndex, scheduleConfig);
    }
    return getTimeForPeriod(colIndex + 1, scheduleConfig);
  };

  const getActualPeriod = (colIndex: number) => {
    if (breakAfterPeriod > 0 && colIndex >= breakAfterPeriod) {
      return colIndex;
    }
    return colIndex + 1;
  };

  return (
    <StepLayout step={4} title="Timetable Subjects">
      <ScrollArea className="h-[500px]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border p-2 text-left font-bold text-xs uppercase tracking-widest text-muted-foreground bg-muted w-24">Day</th>
              {Array.from({ length: totalColumns }, (_, i) => i).map((colIdx) => (
                <th key={colIdx} className="border p-2 text-center min-w-[120px]">
                  <div className="font-bold uppercase">{getColumnLabel(colIdx)}</div>
                  <div className="text-xs text-muted-foreground">{getColumnTime(colIdx)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeDays.map((day, rowIdx) => (
              <tr key={day}>
                <td className="border p-2 font-bold bg-muted/30">{day}</td>
                {Array.from({ length: totalColumns }, (_, colIdx) => {
                  const actualPeriod = getActualPeriod(colIdx);
                  const slot = getSlot(day, actualPeriod);
                  const currentSubject = slot?.subject ?? '';
                  const showInput = showCustomInput[`${day}-${actualPeriod}`] || false;

                  return (
                    <td className={`border p-1 ${breakAfterPeriod > 0 && colIdx === breakAfterPeriod ? 'bg-yellow-100' : rowIdx % 2 === 0 ? 'bg-white' : 'bg-muted/30'}`}>
                      {breakAfterPeriod > 0 && colIdx === breakAfterPeriod ? (
                        <div className="h-9 flex items-center justify-center text-sm font-medium">Break</div>
                      ) : showInput ? (
                        <Input
                          placeholder="Enter subject"
                          defaultValue={currentSubject}
                          onBlur={(e) => handleCustomSubjectSubmit(day, actualPeriod, e.target.value, false)}
                          onKeyDown={(e) => handleKeyDown(e, day, actualPeriod, e.currentTarget.value, false)}
                          className="h-9 bg-background"
                          autoFocus
                        />
                      ) : (
                        <select
                          value={currentSubject || ''}
                          onChange={(e) => handleSubjectChange(day, actualPeriod, e.target.value, false)}
                          className="h-9 w-full border border-border bg-background px-2 py-1 text-sm outline-none focus:border-ferrari-red"
                        >
                          <option value="">Select</option>
                          {allSubjects.map((subj) => (
                            <option key={subj} value={subj}>{subj}</option>
                          ))}
                          <option value="__custom__">Other...</option>
                        </select>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </StepLayout>
  );
}