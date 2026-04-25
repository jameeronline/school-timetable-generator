import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Sun, Moon, BookOpen, Menu, Upload, Share2 } from 'lucide-react';
import { useThemeStore } from '@/store-theme';
import { useEffect, useState, useRef } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useStore } from '@/store';

export function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importTimetable } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const json = event.target?.result as string;
        if (importTimetable(json)) {
          alert('Timetable imported successfully!');
        } else {
          alert('Failed to import timetable. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleShare = () => {
    const url = window.location.origin;
    if (navigator.share) {
      navigator.share({
        title: 'School Timetable Generator',
        text: 'Create beautiful school timetables with this free tool!',
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white border-b border-white/10">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 font-bold tracking-wide">
            <GraduationCap className="h-7 w-7 text-ferrari-red" />
            <span className="text-base hidden md:inline-block tracking-tight">SCHOOL TIMETABLE</span>
            <span className="text-base md:hidden tracking-tight">TIMETABLE</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="hidden md:block"
          >
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 uppercase tracking-widest text-xs">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
            className="text-white/80 hover:text-white hover:bg-white/10 uppercase tracking-widest text-xs"
          >
            <Share2 className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Share</span>
          </Button>
          
          <Link to="/saved" className="hidden md:block">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 uppercase tracking-widest text-xs">
              <BookOpen className="h-4 w-4 mr-2" />
              Saved
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          
          <button 
            className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="right" className="w-64 bg-black text-white border-l border-white/10">
              <div className="flex flex-col gap-4 mt-8">
                <button onClick={() => fileInputRef.current?.click()} className="w-full">
                  <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 uppercase tracking-widest text-xs">
                    <Upload className="h-4 w-4 mr-3" />
                    Import Timetable
                  </Button>
                </button>
                
                <Button 
                  variant="ghost" 
                  onClick={handleShare}
                  className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 uppercase tracking-widest text-xs"
                >
                  <Share2 className="h-4 w-4 mr-3" />
                  Share App
                </Button>
                
                <Link to="/saved" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 uppercase tracking-widest text-xs">
                    <BookOpen className="h-4 w-4 mr-3" />
                    Saved Timetables
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}