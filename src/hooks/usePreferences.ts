import { useState, useEffect, useCallback } from 'react';
import { type UserPreferences, type PreferencesFormData } from '../types/prefs';
import { DEFAULT_PREFERENCES } from '../constants/preferences';
import { supabase } from '../lib/supabase';
import type { UsePreferencesReturn } from '../types/hooks';

export function usePreferences(): UsePreferencesReturn {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('user_prefs')
        .select('*')
        .limit(1)
        .single();

      if (dbError || !data) {
        // No prefs row yet — create one with defaults
        const { data: created, error: insertError } = await supabase
          .from('user_prefs')
          .insert(DEFAULT_PREFERENCES)
          .select()
          .single();

        if (insertError) throw insertError;
        setPrefs(created as UserPreferences);
      } else {
        setPrefs(data as UserPreferences);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const savePrefs = async (data: PreferencesFormData) => {
    if (!prefs) return;
    try {
      setSaving(true);
      setError(null);
      const { data: updated, error: dbError } = await supabase
        .from('user_prefs')
        .update(data)
        .eq('id', prefs.id)
        .select()
        .single();

      if (dbError) throw dbError;
      setPrefs(updated as UserPreferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return { prefs, loading, saving, error, savePrefs };
}