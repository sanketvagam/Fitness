import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMealData } from "@/hooks/useMealData";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function CaloriesChart() {
  const { getWeeklyNutrition } = useMealData();
  const weeklyData = getWeeklyNutrition();

  const data = weeklyData.map(day => ({
    date: format(new Date(day.date), 'EEE'),
    consumed: day.totalCalories,
    target: 2000, // This should come from user profile
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Calories This Week</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <defs>
              <linearGradient id="consumedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.9}/>
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
            <Legend />
            <Bar 
              dataKey="consumed" 
              fill="url(#consumedGradient)"
              radius={[8, 8, 0, 0]}
              name="Consumed"
            />
            <Bar 
              dataKey="target" 
              fill="hsl(var(--muted))"
              radius={[8, 8, 0, 0]}
              name="Target"
              opacity={0.5}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
