import { supabase } from './supabase';

const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;
const REFRESH_THRESHOLD = 10 * 60 * 1000;
const INACTIVITY_TIMEOUT = 8 * 60 * 60 * 1000;
const ACTIVITY_STORAGE_KEY = 'last_activity_timestamp';

let checkInterval: NodeJS.Timeout | null = null;
let inactivityCheckInterval: NodeJS.Timeout | null = null;

const updateLastActivity = () => {
  localStorage.setItem(ACTIVITY_STORAGE_KEY, Date.now().toString());
};

const getLastActivity = (): number => {
  const lastActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY);
  return lastActivity ? parseInt(lastActivity, 10) : Date.now();
};

const setupActivityListeners = () => {
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

  events.forEach(event => {
    window.addEventListener(event, updateLastActivity, { passive: true });
  });
};

const removeActivityListeners = () => {
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

  events.forEach(event => {
    window.removeEventListener(event, updateLastActivity);
  });
};

const checkInactivity = async () => {
  const lastActivity = getLastActivity();
  const now = Date.now();
  const inactiveDuration = now - lastActivity;

  if (inactiveDuration >= INACTIVITY_TIMEOUT) {
    console.log('User inactive for 8 hours, signing out...');
    await supabase.auth.signOut();
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
  }
};

export const startSessionMonitoring = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  if (inactivityCheckInterval) {
    clearInterval(inactivityCheckInterval);
  }

  updateLastActivity();
  setupActivityListeners();

  checkInterval = setInterval(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000).getTime();
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        if (timeUntilExpiry < REFRESH_THRESHOLD) {
          const { data, error } = await supabase.auth.refreshSession();

          if (error) {
            console.error('Failed to refresh session:', error);
          } else {
            console.log('Session refreshed successfully');
          }
        }
      }
    } catch (error) {
      console.error('Session monitoring error:', error);
    }
  }, SESSION_CHECK_INTERVAL);

  inactivityCheckInterval = setInterval(checkInactivity, 60 * 1000);
};

export const stopSessionMonitoring = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  if (inactivityCheckInterval) {
    clearInterval(inactivityCheckInterval);
    inactivityCheckInterval = null;
  }
  removeActivityListeners();
  localStorage.removeItem(ACTIVITY_STORAGE_KEY);
};

export const keepSessionAlive = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return false;
    }

    const { data, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      console.error('Failed to keep session alive:', refreshError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Keep session alive error:', error);
    return false;
  }
};
