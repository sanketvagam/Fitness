import { Card } from "@/components/ui/card";
import { Badge } from "@/types/fitness";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Lock } from '@/components/icons';

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
}

export function BadgeCard({ badge, isUnlocked }: BadgeCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "p-4 text-center transition-all",
          isUnlocked
            ? "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30"
            : "bg-muted/30 border-border/50 opacity-60"
        )}
      >
        <div className="relative inline-block mb-3">
          <div className="text-5xl">{badge.icon}</div>
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
        <p className="text-xs text-muted-foreground">{badge.description}</p>
        {isUnlocked && badge.earnedAt && (
          <p className="text-xs text-primary mt-2">
            ✓ Earned {new Date(badge.earnedAt).toLocaleDateString()}
          </p>
        )}
      </Card>
    </motion.div>
  );
}
