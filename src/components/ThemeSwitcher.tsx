import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex gap-2 p-1 bg-card rounded-lg border"
    >
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('dark')}
        className="gap-2"
      >
        <Moon className="w-4 h-4" />
        Dark
      </Button>
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('light')}
        className="gap-2"
      >
        <Sun className="w-4 h-4" />
        Light
      </Button>
      <Button
        variant={theme === 'gradient' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('gradient')}
        className="gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Gradient
      </Button>
    </motion.div>
  );
}
