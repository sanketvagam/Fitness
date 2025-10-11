import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/types/fitness";
import { User } from '@/components/icons';
import { toast } from "sonner";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (profile: UserProfile) => void;
  currentProfile?: UserProfile;
}

export function UserProfileDialog({ open, onOpenChange, onSave, currentProfile }: UserProfileDialogProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: 25,
    gender: "male",
    weight: 70,
    height: 170,
    activityLevel: "moderate",
    fitnessGoal: "maintain",
  });

  useEffect(() => {
    if (currentProfile) {
      setProfile(currentProfile);
    }
  }, [currentProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.name || profile.age < 10 || profile.weight < 30 || profile.height < 100) {
      toast.error("Please fill in all fields with valid values");
      return;
    }

    onSave(profile);
    toast.success("Profile saved successfully! 💪");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Profile
          </DialogTitle>
          <DialogDescription>
            Tell us about yourself to get personalized recommendations
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              placeholder="Your name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age *</Label>
              <Input
                type="number"
                min="10"
                max="120"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select 
                value={profile.gender} 
                onValueChange={(v: any) => setProfile({ ...profile, gender: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Weight (kg) *</Label>
              <Input
                type="number"
                min="30"
                max="300"
                step="0.1"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>Height (cm) *</Label>
              <Input
                type="number"
                min="100"
                max="250"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Activity Level *</Label>
            <Select 
              value={profile.activityLevel} 
              onValueChange={(v: any) => setProfile({ ...profile, activityLevel: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                <SelectItem value="very-active">Very Active (Athlete)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fitness Goal *</Label>
            <Select 
              value={profile.fitnessGoal} 
              onValueChange={(v: any) => setProfile({ ...profile, fitnessGoal: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose-weight">Lose Weight</SelectItem>
                <SelectItem value="maintain">Maintain Weight</SelectItem>
                <SelectItem value="gain-muscle">Gain Muscle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Save Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
