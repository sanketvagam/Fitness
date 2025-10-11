import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserLevel } from "@/types/fitness";
import { motion } from "framer-motion";
import { Trophy, Zap } from '@/components/icons';

interface LevelProgressProps {
  userLevel: UserLevel;
}

export function LevelProgress({ userLevel }: LevelProgressProps) {
  const progressPercentage = ((userLevel.xp % 100) / 100) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Level {userLevel.level}</h3>
            <p className="text-sm text-muted-foreground">{userLevel.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <Zap className="w-5 h-5" />
          <span className="font-bold text-xl">{userLevel.xp} XP</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress to Level {userLevel.level + 1}</span>
          <span className="font-semibold">{userLevel.xpToNextLevel} XP needed</span>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        >
          <Progress value={progressPercentage} className="h-3" />
        </motion.div>
      </div>
    </Card>
  );
}
