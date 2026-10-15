export interface Habit {
  id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string;
  position: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  date: string;
  all_completed: boolean;
  current_streak: number;
}

export type InterfaceTab = 'scheduler' | 'integrations' | 'analytics' | 'themes';
