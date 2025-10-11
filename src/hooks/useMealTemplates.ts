import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface MealTemplate {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_type: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export function useMealTemplates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<MealTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    if (!user) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('meal_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching meal templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  const searchTemplates = (query: string, mealType?: string): MealTemplate[] => {
    let filtered = templates;

    if (mealType) {
      filtered = filtered.filter(t => t.meal_type === mealType);
    }

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered.slice(0, 10);
  };

  const getTemplateByName = (name: string, mealType?: string): MealTemplate | undefined => {
    return templates.find(
      t => t.name.toLowerCase() === name.toLowerCase() &&
      (!mealType || t.meal_type === mealType)
    );
  };

  const saveTemplate = async (template: Omit<MealTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const existing = getTemplateByName(template.name, template.meal_type);

      if (existing) {
        const { error } = await supabase
          .from('meal_templates')
          .update({
            calories: template.calories,
            protein: template.protein,
            carbs: template.carbs,
            fats: template.fats,
            usage_count: existing.usage_count + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('meal_templates')
          .insert({
            user_id: user.id,
            name: template.name,
            calories: template.calories,
            protein: template.protein,
            carbs: template.carbs,
            fats: template.fats,
            meal_type: template.meal_type,
            usage_count: 1,
          });

        if (error) throw error;
      }

      await fetchTemplates();
    } catch (error) {
      console.error('Error saving meal template:', error);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('meal_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTemplates();
    } catch (error) {
      console.error('Error deleting meal template:', error);
    }
  };

  return {
    templates,
    loading,
    searchTemplates,
    getTemplateByName,
    saveTemplate,
    deleteTemplate,
    refetch: fetchTemplates,
  };
}
