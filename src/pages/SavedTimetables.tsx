import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Calendar, Plus } from 'lucide-react';

export function SavedTimetables() {
  const { savedTimetables, loadTimetable, deleteTimetable } = useStore();
  const navigate = useNavigate();

  const handleLoad = (id: string) => {
    loadTimetable(id);
    navigate('/');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTimetable(id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container py-6 px-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-tight">SAVED TIMETABLES</h1>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">VIEW AND MANAGE YOUR TIMETABLES</p>
      </div>

      {savedTimetables.length === 0 ? (
        <Card className="border border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-6">No saved timetables yet</p>
            <Button onClick={() => navigate('/')} className="uppercase tracking-widest text-xs">
              <Plus className="h-4 w-4 mr-2" />
              Create New Timetable
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedTimetables.map((timetable) => (
            <Card 
              key={timetable.id} 
              className="border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => handleLoad(timetable.id)}
            >
              <CardHeader className="pb-2 border-b border-border/30">
                <CardTitle className="text-lg font-medium">{timetable.name}</CardTitle>
                <div className="flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(timetable.createdAt)}
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {timetable.studentInfo.name || 'Unnamed Student'} - Class {timetable.studentInfo.class}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => handleDelete(timetable.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}