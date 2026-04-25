import { useStore } from '@/store';
import { StepIndicator } from '@/components/StepIndicator';
import { SchoolInfoStep } from '@/components/SchoolInfoStep';
import { StudentInfoStep } from '@/components/StudentInfoStep';
import { ScheduleConfigStep } from '@/components/ScheduleConfigStep';
import { SlotEntryStep } from '@/components/SlotEntryStep';
import { PreviewStep } from '@/components/PreviewStep';

export function Home() {
  const step = useStore((s) => s.step);

  return (
    <div className="container py-10 px-4 max-w-7xl mx-auto">
      <div className="space-y-10">
        <StepIndicator />
        {step === 1 && <SchoolInfoStep />}
        {step === 2 && <StudentInfoStep />}
        {step === 3 && <ScheduleConfigStep />}
        {step === 4 && <SlotEntryStep />}
        {step === 5 && <PreviewStep />}
      </div>
    </div>
  );
}