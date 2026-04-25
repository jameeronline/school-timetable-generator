import { useEffect } from 'react';
import { useStore, getActiveDays } from '@/store';
import { DAYS, type Day, type ScheduleConfig } from '@/types';
import { StepLayout } from './StepLayout';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function ScheduleConfigStep() {
  const { scheduleConfig, setScheduleConfig, initializeSlots } = useStore();
  const config: ScheduleConfig = scheduleConfig;

  useEffect(() => {
    initializeSlots();
  }, [config.weekDaysStart, config.weekDaysEnd, config.periodsCount, config.breakAfterPeriod]);

  const activeDays = getActiveDays(config);

  return (
    <StepLayout step={3} title="Schedule Configuration">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-widest">From Day</label>
          <select
            value={config.weekDaysStart}
            onChange={(e) => setScheduleConfig({ weekDaysStart: e.target.value as Day })}
            className="h-10 w-full border border-border bg-background px-3 py-1 text-sm outline-none focus:border-ferrari-red"
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-widest">To Day</label>
          <select
            value={config.weekDaysEnd}
            onChange={(e) => setScheduleConfig({ weekDaysEnd: e.target.value as Day })}
            className="h-10 w-full border border-border bg-background px-3 py-1 text-sm outline-none focus:border-ferrari-red"
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 grid gap-2">
          <label className="text-xs font-bold uppercase tracking-widest">Active Days</label>
          <div className="flex flex-wrap gap-2 p-3 border border-border bg-muted/20">
            {activeDays.length > 0 ? (
              activeDays.map((day) => (
                <Badge key={day} variant="outline" className="bg-background">{day}</Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No days selected</span>
            )}
          </div>
        </div>

        <div className="md:col-span-2 grid gap-2">
          <label className="text-xs font-bold uppercase tracking-widest">Number of Periods</label>
          <select
            value={config.periodsCount}
            onChange={(e) => setScheduleConfig({ periodsCount: Number(e.target.value) })}
            className="h-10 w-full border border-border bg-background px-3 py-1 text-sm outline-none focus:border-ferrari-red"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? 'period' : 'periods'}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label htmlFor="startTime" className="text-xs font-bold uppercase tracking-widest">Start Time</label>
          <Input
            id="startTime"
            type="time"
            value={config.startTime}
            onChange={(e) => setScheduleConfig({ startTime: e.target.value })}
            className="bg-background"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="periodDuration" className="text-xs font-bold uppercase tracking-widest">Class Duration (minutes)</label>
          <Input
            id="periodDuration"
            type="number"
            min={15}
            max={120}
            step={5}
            value={config.periodDuration}
            onChange={(e) => setScheduleConfig({ periodDuration: Number(e.target.value) })}
            className="bg-background"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="breakAfterPeriod" className="text-xs font-bold uppercase tracking-widest">Break After Period</label>
          <select
            value={config.breakAfterPeriod}
            onChange={(e) => setScheduleConfig({ breakAfterPeriod: Number(e.target.value) })}
            className="h-10 w-full border border-border bg-background px-3 py-1 text-sm outline-none focus:border-ferrari-red"
          >
            {Array.from({ length: config.periodsCount }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>Period {n}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label htmlFor="breakDuration" className="text-xs font-bold uppercase tracking-widest">Break Duration (minutes)</label>
          <Input
            id="breakDuration"
            type="number"
            min={5}
            max={60}
            step={5}
            value={config.breakDuration}
            onChange={(e) => setScheduleConfig({ breakDuration: Number(e.target.value) })}
            className="bg-background"
          />
        </div>
      </div>
    </StepLayout>
  );
}