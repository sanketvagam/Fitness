import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Route, Footprints, Scale, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface QuickActivityWidgetProps {
  onLogActivity: (activity: {
    type: 'workout' | 'distance' | 'steps' | 'weight';
    value: number;
  }) => void;
}

const activityTypes = [
  {
    type: 'workout' as const,
    icon: Dumbbell,
    label: 'Workout',
    unit: 'session',
    quickValues: [1, 2, 3],
  },
  {
    type: 'distance' as const,
    icon: Route,
    label: 'Run',
    unit: 'km',
    quickValues: [2, 5, 10],
  },
  {
    type: 'steps' as const,
    icon: Footprints,
    label: 'Steps',
    unit: 'steps',
    quickValues: [5000, 10000, 15000],
  },
  {
    type: 'weight' as const,
    icon: Scale,
    label: 'Weight',
    unit: 'kg',
    quickValues: [0.5, 1, 2],
  },
];

export function QuickActivityWidget({ onLogActivity }: QuickActivityWidgetProps) {
  const [selectedType, setSelectedType] = useState<typeof activityTypes[0] | null>(null);
  const [value, setValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleQuickLog = (type: typeof activityTypes[0], quickValue: number) => {
    onLogActivity({
      type: type.type,
      value: quickValue,
    });
    toast.success(`${quickValue} ${type.unit} logged!`);
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

    toast.success(`${value} ${selectedType.unit} logged!`);
    setValue('');
    setSelectedType(null);
    setIsExpanded(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Quick Log</CardTitle>
            <CardDescription>Track your activity instantly</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Simple' : 'Custom'}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="simple"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {activityTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.type} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
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
                      <Icon className="w-4 h-4" />
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
      </CardContent>
    </Card>
  );
}
