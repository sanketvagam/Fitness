import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Activity, Waves, Footprints, Scale, Plus, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface QuickActivityWidgetProps {
  onLogActivity: (activity: {
    type: 'running' | 'swimming' | 'steps' | 'weight' | 'exercise';
    value: number;
    unit?: string;
  }) => void;
}

const activityTypes = [
  {
    type: 'exercise' as const,
    icon: Zap,
    label: 'exercise',
    unit: 'min',
    color: 'from-red-500 to-pink-500',
    quickValues: [5, 10, 15],
  },
  {
    type: 'steps' as const,
    icon: Footprints,
    label: 'Steps',
    unit: 'steps',
    color: 'from-orange-500 to-yellow-500',
    quickValues: [5000, 10000, 15000],
  },
  {
    type: 'running' as const,
    icon: Activity,
    label: 'Running',
    unit: 'km',
    color: 'from-blue-500 to-cyan-500',
    quickValues: [2, 5, 10],
  },
  {
    type: 'swimming' as const,
    icon: Waves,
    label: 'Swimming',
    unit: 'laps',
    color: 'from-teal-500 to-emerald-500',
    quickValues: [10, 20, 30],
  },
  {
    type: 'weight' as const,
    icon: Scale,
    label: 'Weight',
    unit: 'kg',
    color: 'from-red-500 to-pink-500',
    quickValues: [0.5, 1, 2],
  }

];

export function QuickActivityWidget({ onLogActivity }: QuickActivityWidgetProps) {
  const [selectedType, setSelectedType] = useState<typeof activityTypes[0] | null>(null);
  const [value, setValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleQuickLog = (type: typeof activityTypes[0], quickValue: number) => {
    console.log(type.type);
    console.log(quickValue);
    onLogActivity({
      type: type.type,
      value: quickValue,
    });
    toast.success(`${quickValue} ${type.unit} logged! 💪`);
  };

  const handleExerciseLog = (duration: { label: string; value: number; unit: string }) => {
    onLogActivity({
      type: 'exercise',
      value: duration.value,
      unit: duration.unit,
    });
    toast.success(`${duration.label} exercise logged! 💪`);
  };

  const handleCustomLog = () => {
    if (!selectedType || !value) {
      toast.error('Please enter a value');
      return;
    }

    onLogActivity({
      type: selectedType.type,
      value: Number(value),
    });

    toast.success(`${value} ${selectedType.unit} logged! 💪`);
    setValue('');
    setSelectedType(null);
    setIsExpanded(false);
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Quick Log</h3>
              <p className="text-xs text-white/90">Track your activity instantly</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/20"
          >
            {isExpanded ? 'Simple' : 'Custom'}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="simple"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="border-b pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-sm">Personalized Exercise</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    Priority
                  </Badge>
                </div>

              </div>

              {activityTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.type} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center',
                          type.color
                        )}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">{type.label}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {type.unit}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {type.quickValues.map((quickValue) => (
                        <Button
                          key={quickValue}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickLog(type, quickValue)}
                          className="flex-1 h-9"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {quickValue}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {activityTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.type}
                      variant={selectedType?.type === type.type ? 'default' : 'outline'}
                      onClick={() => setSelectedType(type)}
                      className="h-auto py-3 flex flex-col gap-1"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{type.label}</span>
                    </Button>
                  );
                })}
              </div>

              {selectedType && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder={`Enter ${selectedType.unit}`}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleCustomLog}
                      disabled={!value}
                      className={cn('bg-gradient-to-r', selectedType.color)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Log
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
