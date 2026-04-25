import { useState } from 'react';
import { useStore, getActiveDays, getTimeForPeriod } from '@/store';
import { type Day } from '@/types';
import { StepLayout } from './StepLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Printer, Save, Palette, ArrowLeft, AlignLeft, AlignCenter, AlignRight, Download, QrCode } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';

type PDFFontStyle = 'classic' | 'modern' | 'playful';
type PDFTheme = 'default' | 'blue' | 'green' | 'minimal' | 'custom';
type HeaderAlign = 'left' | 'center' | 'right';

const themeColors: Record<PDFTheme, string> = {
  default: '#DA291C',
  blue: '#1E40AF',
  green: '#15803D',
  minimal: '#1F2937',
  custom: '#DA291C',
};

const fontStyles: Record<PDFFontStyle, { family: string; weight: string; borderWidth: string; borderRadius: string }> = {
  classic: { family: 'Georgia, serif', weight: '700', borderWidth: '2px', borderRadius: '0px' },
  modern: { family: 'Inter, sans-serif', weight: '600', borderWidth: '1px', borderRadius: '4px' },
  playful: { family: 'Comic Sans MS, cursive', weight: '700', borderWidth: '3px', borderRadius: '8px' },
};

export function PreviewStep() {
  const { schoolInfo, studentInfo, scheduleConfig, slots, printConfig, setPrintConfig, saveTimetable, setStep, exportTimetable } = useStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [timetableName, setTimetableName] = useState('');
  const [pdfTheme, setPdfTheme] = useState<PDFTheme>('default');
  const [customColor, setCustomColor] = useState('#DA291C');
  const [headerAlign, setHeaderAlign] = useState<HeaderAlign>('center');
  const [fontStyle, setFontStyle] = useState<PDFFontStyle>('classic');
  const [showQR, setShowQR] = useState(true);

  const activeDays = getActiveDays(scheduleConfig);
  const printDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getSlot = (day: Day, period: number) => {
    return slots.find((s) => s.day === day && s.period === period);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    if (timetableName.trim()) {
      saveTimetable(timetableName.trim());
      setShowSaveDialog(false);
      setTimetableName('');
    }
  };

  const handleExport = () => {
    const json = exportTimetable();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable-${studentInfo.name || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const headerColor = pdfTheme === 'custom' ? customColor : themeColors[pdfTheme];
  const breakAfterPeriod = scheduleConfig.breakAfterPeriod;
  const totalColumns = scheduleConfig.periodsCount + (breakAfterPeriod > 0 ? 1 : 0);
  const style = fontStyles[fontStyle];

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

  const getColumnLabel = (colIndex: number) => {
    if (breakAfterPeriod > 0 && colIndex === breakAfterPeriod) {
      return 'Break';
    }
    if (colIndex < breakAfterPeriod) {
      return `P${colIndex + 1}`;
    }
    return `P${colIndex}`;
  };

  const qrData = [
    `School: ${schoolInfo.name || 'N/A'}`,
    `Address: ${schoolInfo.address || 'N/A'}`,
    `Student: ${studentInfo.name || 'N/A'}`,
    `Class: ${studentInfo.class || 'N/A'}`,
    `Section: ${studentInfo.section || 'N/A'}`,
    `Year: ${studentInfo.academicYear || 'N/A'}`,
  ].join('\n');

  return (
    <StepLayout step={5} title="Preview & Print">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="grid gap-2 w-full lg:w-auto">
            <label htmlFor="preparedBy" className="text-xs font-bold uppercase tracking-widest">Prepared By</label>
            <Input
              id="preparedBy"
              value={printConfig.preparedBy}
              onChange={(e) => setPrintConfig({ preparedBy: e.target.value })}
              placeholder="Enter your name"
              className="w-full lg:w-64 h-10 bg-background"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <Button variant="outline" onClick={() => setStep(4)} className="h-10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="outline" onClick={handleExport} className="h-10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => setShowSaveDialog(true)} className="h-10">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handlePrint} className="h-10 px-6">
              <Printer className="h-4 w-4 mr-2" />
              Print / Save PDF
            </Button>
          </div>
        </div>

        {showSaveDialog && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Save Timetable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter timetable name"
                  value={timetableName}
                  onChange={(e) => setTimetableName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="h-10 bg-background"
                />
                <Button onClick={handleSave} disabled={!timetableName.trim()} className="h-10">Save</Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="h-10">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-bold">Theme:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={pdfTheme === 'default' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPdfTheme('default')}
              className="w-8 h-8 p-0"
              style={{ backgroundColor: '#DA291C' }}
              title="Ferrari Red"
            />
            <Button
              variant={pdfTheme === 'blue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPdfTheme('blue')}
              className="w-8 h-8 p-0"
              style={{ backgroundColor: '#1E40AF' }}
              title="Blue"
            />
            <Button
              variant={pdfTheme === 'green' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPdfTheme('green')}
              className="w-8 h-8 p-0"
              style={{ backgroundColor: '#15803D' }}
              title="Green"
            />
            <Button
              variant={pdfTheme === 'minimal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPdfTheme('minimal')}
              className="w-8 h-8 p-0"
              style={{ backgroundColor: '#1F2937' }}
              title="Minimal"
            />
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                setPdfTheme('custom');
              }}
              className="w-8 h-8 cursor-pointer"
              title="Custom Color"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <span className="text-sm font-bold">Style:</span>
          <div className="flex gap-2">
            {(['classic', 'modern', 'playful'] as PDFFontStyle[]).map((style) => (
              <Button
                key={style}
                variant={fontStyle === style ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontStyle(style)}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">Header:</span>
            <div className="flex gap-1">
              <Button
                variant={headerAlign === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHeaderAlign('left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={headerAlign === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHeaderAlign('center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={headerAlign === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHeaderAlign('right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showQR ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowQR(!showQR)}
            >
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
          </div>
        </div>

        <div id="timetable-print" className="bg-white p-2 sm:p-4 border overflow-auto" style={{ fontFamily: style.family, width: '297mm', minHeight: '210mm' }}>
          <div className="flex justify-between items-start mb-4 pb-3 border-b">
            <div className="flex items-start gap-3">
              {schoolInfo.logo && (
                <img src={schoolInfo.logo} alt="Logo" className="h-12 w-12 sm:h-16 sm:w-16 object-contain" />
              )}
              <div>
                <h1 className="text-lg sm:text-xl font-bold" style={{ fontWeight: style.weight }}>{schoolInfo.name || 'School Name'}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">{schoolInfo.address || 'School Address'}</p>
              </div>
            </div>
            {showQR && (
              <div className="flex-shrink-0">
                <QRCodeSVG value={qrData} size={72} />
              </div>
            )}
          </div>

          <table className="w-full text-xs sm:text-sm mb-4">
            <tbody>
              <tr>
                <td className="py-1 pr-4"><span className="font-bold">Student:</span></td>
                <td className="py-1 pr-4">{studentInfo.name || '-'}</td>
                <td className="py-1 pr-4"><span className="font-bold">Class:</span></td>
                <td className="py-1 pr-4">{studentInfo.class || '-'}</td>
                <td className="py-1 pr-4"><span className="font-bold">Section:</span></td>
                <td className="py-1 pr-4">{studentInfo.section || '-'}</td>
                <td className="py-1"><span className="font-bold">Year:</span></td>
                <td className="py-1">{studentInfo.academicYear || '-'}</td>
              </tr>
            </tbody>
          </table>

          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr>
                <th style={{ backgroundColor: headerColor, color: 'white', borderRadius: style.borderRadius }} className="border p-2 text-left">{headerAlign === 'center' ? '' : 'Day'}</th>
                {Array.from({ length: totalColumns }, (_, i) => i).map((colIdx) => (
                  <th key={colIdx} style={{ backgroundColor: headerColor, color: 'white', borderRadius: style.borderRadius }} className="border p-2 text-center">
                    <div>{getColumnLabel(colIdx)}</div>
                    <div className="text-xs font-normal opacity-80">{getColumnTime(colIdx)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeDays.map((day, rowIdx) => (
                <tr key={day}>
                  <td className={`border p-2 font-bold ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-muted/30'}`}>{day}</td>
                  {Array.from({ length: totalColumns }, (_, colIdx) => {
                    const actualPeriod = breakAfterPeriod > 0 && colIdx >= breakAfterPeriod ? colIdx : colIdx + 1;
                    const slot = getSlot(day, actualPeriod);
                    const isBreakCol = breakAfterPeriod > 0 && colIdx === breakAfterPeriod;
                    
                    return (
                      <td key={colIdx} className={`border p-2 text-center ${isBreakCol ? 'bg-yellow-100' : rowIdx % 2 === 0 ? 'bg-white' : 'bg-muted/30'}`}>
                        {isBreakCol ? 'Break' : (slot?.subject || '-')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4 sm:mt-6 pt-4 border-t text-xs sm:text-sm">
            <div><span className="font-bold">Prepared By:</span> {printConfig.preparedBy || '-'}</div>
            <div><span className="font-bold">Printed:</span> {printDate}</div>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}