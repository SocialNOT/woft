
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProgress } from '../types';

/**
 * TEXTSCRIBE CLOUD INFRASTRUCTURE
 * Managing Supabase (User State) with Local Fallback.
 * Credentials provided for project: wgaasauzzbelpncntsds
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wgaasauzzbelpncntsds.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYWFzYXV6emJlbHBuY250c2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzk2NTUsImV4cCI6MjA3OTg1NTY1NX0.b0yzmD16cZ_AdOMYuxi9cPfglRSPp0UHGPd-rmt_dss';

// Initialize Supabase Client
export const supabase: SupabaseClient | null = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

const LOCAL_STORAGE_KEY = 'textscribe_user_progress';

/**
 * SYNC USER PROGRESS
 * Persists the profile to Supabase if available, otherwise to LocalStorage.
 */
export const syncUserProgress = async (userId: string, progress: UserProgress) => {
  // Always update local storage first as a safety buffer
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));

  if (!supabase) {
    console.warn('[SUPABASE] Client not initialized. Progress saved to LocalStorage only.');
    return;
  }

  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({ 
        id: userId, 
        progress_data: progress,
        last_synced_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) throw error;
    console.log(`[SUPABASE SYNC] Profile updated for architect ${userId}`);
  } catch (err) {
    console.error('[SUPABASE SYNC FAILURE]', err);
  }
};

/**
 * FETCH USER PROGRESS
 * Retrieves user state from Cloud (Supabase) or LocalStorage.
 */
export const fetchUserProgress = async (userId: string): Promise<UserProgress | null> => {
  // Try LocalStorage first for instant load
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  let progress: UserProgress | null = localData ? JSON.parse(localData) : null;

  if (!supabase) {
    return progress;
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('progress_data')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data?.progress_data) {
      progress = data.progress_data as UserProgress;
      // Sync local storage with cloud data
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    }
  } catch (err) {
    console.warn('[SUPABASE FETCH] Using LocalStorage data fallback.', err);
  }
  
  return progress;
};

/**
 * LOG NEURAL EVENT
 * Stores prompt engineering history for future RAG training.
 */
export const logNeuralEvent = async (userId: string, type: string, metadata: any) => {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('neural_logs')
      .insert({
        user_id: userId,
        event_type: type,
        meta_data: metadata,
        created_at: new Date().toISOString()
      });
    if (error) throw error;
  } catch (err) {
    console.error('[NEURAL LOG FAILURE]', err);
  }
};
