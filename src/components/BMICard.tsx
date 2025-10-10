import { Card } from "@/components/ui/card";
import { BMIData } from "@/types/fitness";
import { Activity } from "lucide-react";
import { ProgressRing } from "./ProgressRing";

interface BMICardProps {
  bmiData: BMIData;
}

export function BMICard({ bmiData }: BMICardProps) {
  // Convert BMI to percentage for visual display (18.5-30 range)
  const bmiPercentage = Math.min(((bmiData.bmi - 18.5) / (30 - 18.5)) * 100, 100);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Underweight":
        return "text-blue-500";
      case "Normal Weight":
        return "text-green-500";
      case "Overweight":
        return "text-yellow-500";
      case "Obese":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="p-6 border-border/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg mb-1">Your BMI</h3>
          <p className="text-sm text-muted-foreground">Body Mass Index</p>
        </div>
        <div className="p-2 rounded-full bg-primary/10">
          <Activity className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <ProgressRing progress={bmiPercentage} size={100} />
        <div className="flex-1">
          <p className="text-3xl font-bold mb-1">{bmiData.bmi}</p>
          <p className={`text-sm font-semibold mb-2 ${getCategoryColor(bmiData.category)}`}>
            {bmiData.category}
          </p>
          <p className="text-xs text-muted-foreground">
            {bmiData.healthStatus}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-1"></div>
            <p className="text-muted-foreground">&lt;18.5</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-1"></div>
            <p className="text-muted-foreground">18.5-25</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mx-auto mb-1"></div>
            <p className="text-muted-foreground">25-30</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1"></div>
            <p className="text-muted-foreground">&gt;30</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
