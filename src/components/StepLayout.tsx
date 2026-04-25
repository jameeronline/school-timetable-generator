import type { ReactNode } from 'react';
import { useStore } from '@/store';
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface StepLayoutProps {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
  onNext?: () => boolean;
}

const stepDescriptions: Record<number, string> = {
  1: 'ENTER SCHOOL INFORMATION TO INCLUDE ON THE TIMETABLE',
  2: 'ADD STUDENT DETAILS FOR PERSONALIZED TIMETABLE',
  3: 'CONFIGURE SCHOOL SCHEDULE AND TIMING',
  4: 'FILL IN SUBJECTS FOR EACH PERIOD OF THE WEEK',
  5: 'PREVIEW AND PRINT YOUR TIMETABLE',
};

export function StepLayout({ step, title, description, children, onNext }: StepLayoutProps) {
  const { setStep, step: currentStep } = useStore();
  const isCurrent = currentStep === step;
  const isLastStep = step === 5;

  const handleNext = () => {
    if (onNext && !onNext()) {
      return;
    }
    setStep(step + 1);
  };

  return (
    <Card className="w-full border border-border/50 bg-card">
      <CardHeader className="pb-4 border-b border-border/30">
        <h1 className="text-2xl font-medium tracking-tight uppercase">{title}</h1>
        {/* <CardTitle className="text-2xl font-bold tracking-normal">{title}</CardTitle> */}
        <CardDescription className="text-xs uppercase tracking-widest text-muted-foreground">
          {description || stepDescriptions[step]}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">{children}</CardContent>
      {isCurrent && !isLastStep && (
        <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-border/30 bg-muted/20">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              className="h-10 px-5 text-xs uppercase tracking-widest border-border bg-background"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          ) : <div />}
          
          <Button 
            variant="default"
            onClick={handleNext}
            className="h-10 px-6 text-xs uppercase tracking-widest"
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}