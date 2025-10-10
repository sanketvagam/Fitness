import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useWeightData } from "@/hooks/useWeightData";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function WeightChart() {
  const { getWeightHistory } = useWeightData();
  const weightHistory = getWeightHistory(30);

  const data = weightHistory.map(entry => ({
    date: format(new Date(entry.date), 'MMM dd'),
    weight: entry.weight,
  }));

  if (data.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No weight data yet. Add your weight to see progress!</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Weight Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
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
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#weightGradient)"
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
