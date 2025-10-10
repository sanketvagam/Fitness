import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/fitness';
import { toast } from '@/hooks/use-toast';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.name,
          age: data.age,
          gender: data.gender,
          weight: parseFloat(data.weight),
          height: parseFloat(data.height),
          activityLevel: data.activity_level,
          fitnessGoal: data.fitness_goal,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: UserProfile) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name: profileData.name,
        age: profileData.age,
        gender: profileData.gender,
        weight: profileData.weight,
        height: profileData.height,
        activity_level: profileData.activityLevel,
        fitness_goal: profileData.fitnessGoal,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setProfile(profileData);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
      });
    }
  };

  return { profile, loading, saveProfile, refetch: fetchProfile };
};
