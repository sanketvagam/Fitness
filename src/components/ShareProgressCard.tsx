import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardStats, UserLevel } from "@/types/fitness";
import { Share2, Download } from '@/components/icons';
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { useRef } from "react";

interface ShareProgressCardProps {
  stats: DashboardStats;
  userLevel: UserLevel;
  userName?: string;
}

const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Success starts with self-discipline.",
  "Push yourself because no one else is going to do it for you.",
  "The pain you feel today will be the strength you feel tomorrow.",
];

export function ShareProgressCard({ stats, userLevel, userName }: ShareProgressCardProps) {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f0f0f',
        scale: 2,
      });
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        if (navigator.share) {
          const file = new File([blob], 'fitness-progress.png', { type: 'image/png' });
          navigator.share({
            title: 'My Fitness Progress',
            text: `Check out my progress! Level ${userLevel.level} 🏆`,
            files: [file],
          }).catch(() => {
            // Fallback to download if share fails
            downloadImage(canvas);
          });
        } else {
          downloadImage(canvas);
        }
      });
      
      toast({
        title: "Success!",
        description: "Progress card generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate progress card",
        variant: "destructive",
      });
    }
  };

  const downloadImage = (canvas: HTMLCanvasElement) => {
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'fitness-progress.png';
    link.href = url;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div ref={cardRef} className="relative">
        <Card className="p-8 bg-gradient-to-br from-primary via-secondary to-accent text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">
                {userName || "My"} Fitness Journey
              </h2>
              <p className="text-white/80 text-sm">Powered by HabitBar</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold mb-1">{userLevel.level}</div>
                <div className="text-sm text-white/80">Level</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold mb-1">{stats.completed}</div>
                <div className="text-sm text-white/80">Goals Done</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold mb-1">{stats.currentStreak}</div>
                <div className="text-sm text-white/80">Day Streak</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold mb-1">{userLevel.xp}</div>
                <div className="text-sm text-white/80">Total XP</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-sm italic">"{randomQuote}"</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleShare} className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Share Progress
        </Button>
        <Button onClick={() => cardRef.current && downloadImage(cardRef.current as any)} variant="outline">
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
