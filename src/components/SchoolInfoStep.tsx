import { useState, useRef } from 'react';
import { useStore } from '@/store';
import { StepLayout } from './StepLayout';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

export function SchoolInfoStep() {
  const { schoolInfo, setSchoolInfo } = useStore();
  const [logoPreview, setLogoPreview] = useState<string | null>(schoolInfo.logo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setSchoolInfo({ logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setSchoolInfo({ logo: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <StepLayout 
      step={1} 
      title="School Information"
      onNext={() => {
        if (!schoolInfo.name.trim()) {
          setErrors({ name: 'School name is required' });
          return false;
        }
        setErrors({});
        return true;
      }}
    >
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest">School Logo</label>
          <div className="flex items-center gap-4 w-full">
            {logoPreview ? (
              <div className="relative">
                <img 
                  src={logoPreview} 
                  alt="School Logo" 
                  className="h-20 w-20 object-contain border" 
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={handleRemoveLogo}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div 
                className="h-20 w-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Click to upload logo</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="schoolName" className="text-xs font-bold uppercase tracking-widest">School Name *</label>
          <Input
            id="schoolName"
            value={schoolInfo.name}
            onChange={(e) => setSchoolInfo({ name: e.target.value })}
            placeholder="Enter school name"
            className="bg-background"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="grid gap-2">
          <label htmlFor="schoolAddress" className="text-xs font-bold uppercase tracking-widest">School Address</label>
          <Textarea
            id="schoolAddress"
            value={schoolInfo.address}
            onChange={(e) => setSchoolInfo({ address: e.target.value })}
            placeholder="Enter school address"
            rows={3}
            className="bg-background"
          />
        </div>
      </div>
    </StepLayout>
  );
}