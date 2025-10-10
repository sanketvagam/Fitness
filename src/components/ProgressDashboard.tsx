import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeightChart } from "./analytics/WeightChart";
import { CaloriesChart } from "./analytics/CaloriesChart";
import { ActivityChart } from "./analytics/ActivityChart";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export function ProgressDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Your Progress</h2>
          <p className="text-sm text-muted-foreground">Track your fitness journey</p>
        </div>
      </div>

      <Tabs defaultValue="weight" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="weight">
          <WeightChart />
        </TabsContent>

        <TabsContent value="calories">
          <CaloriesChart />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityChart />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
