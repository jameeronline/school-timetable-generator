import { useStore } from '@/store';
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { num: 1, label: 'SCHOOL' },
  { num: 2, label: 'STUDENT' },
  { num: 3, label: 'SCHEDULE' },
  { num: 4, label: 'SUBJECTS' },
  { num: 5, label: 'PREVIEW' },
];

export function StepIndicator() {
  const currentStep = useStore((s) => s.step);
  const { reset } = useStore();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data?')) {
      reset();
    }
  };

  return (
    <div className="w-full bg-black border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isActive = currentStep === s.num;
            const isPending = currentStep < s.num;
            
            return (
              <div key={s.num} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border-r border-white/10",
                    isActive && "bg-ferrari-red text-white",
                    isCompleted && "bg-white text-black",
                    isPending && "bg-transparent text-white/50 hover:text-white hover:bg-white/5"
                  )}
                  style={{ borderRadius: 0 }}
                >
                  <span>{s.num}.</span>
                  <span className="hidden md:inline">{s.label}</span>
                  <span className="md:hidden">{s.label.charAt(0)}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleReset} 
          className="h-full px-4 text-white/60 hover:text-white hover:bg-white/5 uppercase tracking-widest text-xs border-l border-white/10"
        >
          <RotateCcw className="h-3 w-3 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}