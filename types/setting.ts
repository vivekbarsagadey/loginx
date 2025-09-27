
export type Theme = 'light' | 'dark' | 'system';

export interface Setting {
  id: number;
  theme: Theme;
  notifications: number;
}
