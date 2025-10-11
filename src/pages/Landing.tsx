import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { SignupDialog } from '@/components/auth/SignupDialog';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Target, TrendingUp, Award, Users, Zap, Shield } from '@/components/icons';
import { motion } from 'framer-motion';

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const features = [
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set and achieve your fitness goals with precision tracking',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visualize your journey with detailed charts and insights',
    },
    {
      icon: Award,
      title: 'Achievements',
      description: 'Unlock badges and level up as you reach milestones',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join challenges and compete with friends',
    },
    {
      icon: Zap,
      title: 'Smart Plans',
      description: 'Get personalized workout and meal recommendations',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure and always under your control',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HabitBar
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Button variant="ghost" onClick={() => setLoginOpen(true)}>
                Sign In
              </Button>
              <Button onClick={() => setSignupOpen(true)}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Raise the bar, never skip the habit
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Transform your body, mind, and lifestyle with intelligent tracking, gamification, and
                community support
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => setSignupOpen(true)} className="text-lg px-8">
                  Start Your Journey
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLoginOpen(true)}
                  className="text-lg px-8"
                >
                  Sign In
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h3>
              <p className="text-lg text-muted-foreground">
                Powerful features to help you reach your fitness goals
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who are transforming their lives with HabitBar
              </p>
              <Button size="lg" onClick={() => setSignupOpen(true)} className="text-lg px-8">
                Create Free Account
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 HabitBar. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />

      <SignupDialog
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />
    </div>
  );
};

export default Landing;
