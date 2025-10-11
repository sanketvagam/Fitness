import { Card } from "@/components/ui/card";
import { LeaderboardEntry } from "@/types/fitness";
import { Trophy, Award, TrendingUp } from '@/components/icons';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Leaderboard</h2>
          <p className="text-sm text-muted-foreground">Top performers this month</p>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              className={cn(
                "p-4 rounded-lg border transition-all hover:scale-[1.02]",
                entry.rank <= 3
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30"
                  : "bg-card border-border/50",
                entry.id === currentUserId && "ring-2 ring-primary"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    {entry.rank <= 3 ? (
                      <div className="text-3xl">
                        {entry.rank === 1 && "🥇"}
                        {entry.rank === 2 && "🥈"}
                        {entry.rank === 3 && "🥉"}
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-muted-foreground">
                        #{entry.rank}
                      </span>
                    )}
                  </div>
                  <div className="text-3xl">{entry.avatar}</div>
                  <div>
                    <h3 className="font-bold">{entry.username}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Level {entry.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {entry.badges} badges
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">XP</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
