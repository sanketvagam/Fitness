import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFitnessData } from "@/hooks/useFitnessData";
import { format, subDays } from "date-fns";
import { motion } from "framer-motion";

export function ActivityChart() {
  const { activities } = useFitnessData();

  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Sum activity values for this day
    const dayActivities = activities.filter(a => a.date === dateStr);
    const totalMinutes = dayActivities.reduce((sum, a) => sum + a.value, 0);
    
    return {
      date: format(date, 'EEE'),
      minutes: totalMinutes,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Minutes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={last7Days}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="minutes" 
              stroke="hsl(var(--secondary))"
              strokeWidth={3}
              fill="url(#activityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
