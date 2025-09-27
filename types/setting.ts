
export type Theme = 'light' | 'dark' | 'system';

export interface Setting {
  id: number;
  theme: Theme;
  pushEnabled: number;
  emailUpdates: number;
  marketingTips: number;
}
