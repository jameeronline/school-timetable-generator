import { useStore } from '@/store';
import { StepLayout } from './StepLayout';
import { Input } from "@/components/ui/input";

export function StudentInfoStep() {
  const { studentInfo, setStudentInfo } = useStore();

  return (
    <StepLayout step={2} title="Student Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label htmlFor="studentName" className="text-xs font-bold uppercase tracking-widest">Student Name</label>
          <Input
            id="studentName"
            value={studentInfo.name}
            onChange={(e) => setStudentInfo({ name: e.target.value })}
            placeholder="Enter student name"
            className="bg-background"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="studentClass" className="text-xs font-bold uppercase tracking-widest">Class</label>
          <Input
            id="studentClass"
            value={studentInfo.class}
            onChange={(e) => setStudentInfo({ class: e.target.value })}
            placeholder="e.g., 5"
            className="bg-background"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="studentSection" className="text-xs font-bold uppercase tracking-widest">Section</label>
          <Input
            id="studentSection"
            value={studentInfo.section}
            onChange={(e) => setStudentInfo({ section: e.target.value })}
            placeholder="e.g., A"
            className="bg-background"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="academicYear" className="text-xs font-bold uppercase tracking-widest">Academic Year</label>
          <Input
            id="academicYear"
            value={studentInfo.academicYear}
            onChange={(e) => setStudentInfo({ academicYear: e.target.value })}
            placeholder="e.g., 2025-26"
            className="bg-background"
          />
        </div>
      </div>
    </StepLayout>
  );
}