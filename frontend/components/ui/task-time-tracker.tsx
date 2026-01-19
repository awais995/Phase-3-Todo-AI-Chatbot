'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Timer, Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { formatTime } from '@/lib/task-types';

interface TimeTrackerProps {
  taskId: number;
  totalMinutes: number;
  timeEntries: Array<{
    id: string;
    date: string;
    minutes: number;
  }>;
  onTimeLog: (minutes: number) => void;
  onTimeDelete: (entryId: string) => void;
}

export function TaskTimeTracker({ taskId, totalMinutes, timeEntries, onTimeLog, onTimeDelete }: TimeTrackerProps) {
  const [manualMinutes, setManualMinutes] = useState<number>(0);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Effect to handle timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTracking && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedSeconds(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTracking, startTime]);

  // Start timer
  const startTimer = () => {
    setIsTracking(true);
    setStartTime(Date.now());
  };

  // Stop timer
  const stopTimer = () => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      if (minutes > 0) {
        onTimeLog(minutes);
      }
      setIsTracking(false);
      setStartTime(null);
      setElapsedSeconds(0);
    }
  };

  // Reset timer
  const resetTimer = () => {
    setIsTracking(false);
    setStartTime(null);
    setElapsedSeconds(0);
  };

  // Handle manual time entry
  const handleManualEntry = () => {
    if (manualMinutes > 0) {
      onTimeLog(manualMinutes);
      setManualMinutes(0);
    }
  };

  const currentSessionTime = isTracking && startTime ? Math.floor((Date.now() - startTime) / 60000) : 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold text-foreground">Time Tracking</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Session Timer */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Current Session</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">{formatTime(currentSessionTime)}</span>
            {isTracking ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={stopTimer}
                className="h-8 w-8 p-0"
                aria-label="Stop timer"
              >
                <Pause className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={startTimer}
                className="h-8 w-8 p-0"
                aria-label="Start timer"
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
            {isTracking && (
              <Button
                size="sm"
                variant="outline"
                onClick={resetTimer}
                className="h-8 w-8 p-0"
                aria-label="Reset timer"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Manual Entry */}
        <div className="flex gap-2">
          <Input
            type="number"
            value={manualMinutes || ''}
            onChange={(e) => setManualMinutes(Number(e.target.value))}
            placeholder="Minutes"
            min="1"
            className="h-9"
          />
          <Button
            onClick={handleManualEntry}
            disabled={manualMinutes <= 0}
            size="sm"
            className="h-9"
          >
            Log Time
          </Button>
        </div>

        {/* Total Time */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm font-medium">Total Time Spent</span>
          <Badge variant="secondary" className="text-sm">
            {formatTime(totalMinutes)}
          </Badge>
        </div>

        {/* Time Entries */}
        {timeEntries.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Recent Entries</h4>
            <div className="space-y-1">
              {timeEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between text-sm p-2 bg-muted/20 rounded">
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <span>{formatTime(entry.minutes)}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onTimeDelete(entry.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      aria-label={`Delete time entry of ${entry.minutes} minutes`}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}