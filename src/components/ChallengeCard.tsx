import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Challenge, UserChallenge } from "@/types/fitness";
import { Users, Calendar, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface ChallengeCardProps {
  challenge: Challenge;
  userChallenge?: UserChallenge;
  onJoin: (challengeId: string) => void;
  onLeave: (challengeId: string) => void;
}

const categoryIcons: Record<Challenge["category"], string> = {
  calories: "🔥",
  steps: "👟",
  workouts: "💪",
  distance: "🏃",
};

export function ChallengeCard({ challenge, userChallenge, onJoin, onLeave }: ChallengeCardProps) {
  const isJoined = !!userChallenge;
  const progress = userChallenge ? (userChallenge.progress / challenge.goal) * 100 : 0;
  const daysLeft = Math.ceil(
    (new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 border-border/50 hover:border-primary/50 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{categoryIcons[challenge.category]}</span>
            <div>
              <h3 className="font-bold text-lg">{challenge.name}</h3>
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isJoined && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-semibold">
                  {userChallenge.progress} / {challenge.goal} {challenge.unit}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{challenge.participants.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{daysLeft} days left</span>
              </div>
            </div>
            {isJoined && progress >= 100 && (
              <div className="flex items-center gap-1 text-primary font-semibold">
                <Trophy className="w-4 h-4" />
                <span>Completed!</span>
              </div>
            )}
          </div>

          {isJoined ? (
            <Button
              onClick={() => onLeave(challenge.id)}
              variant="outline"
              className="w-full"
            >
              Leave Challenge
            </Button>
          ) : (
            <Button
              disabled
              className="w-full"
            >
              Coming Soon
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
