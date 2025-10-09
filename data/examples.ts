/**
 * Example Data
 * Sample data for testing, demonstrations, and development
 */

/**
 * Sample user profiles
 */
export interface SampleUser {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  joinedAt: string;
}

export const sampleUsers: SampleUser[] = [
  {
    id: 'user_1',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    photoURL: 'https://i.pravatar.cc/150?img=1',
    bio: 'Software developer passionate about mobile apps and user experience.',
    joinedAt: '2024-01-15',
  },
  {
    id: 'user_2',
    displayName: 'Jane Smith',
    email: 'jane.smith@example.com',
    photoURL: 'https://i.pravatar.cc/150?img=5',
    bio: 'Designer and creative thinker. Love to make beautiful interfaces.',
    joinedAt: '2024-02-20',
  },
  {
    id: 'user_3',
    displayName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    photoURL: 'https://i.pravatar.cc/150?img=8',
    bio: 'Tech enthusiast and early adopter. Always trying new apps!',
    joinedAt: '2024-03-10',
  },
];

/**
 * Sample items for list demonstrations
 */
export interface SampleItem {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  completed?: boolean;
}

export const sampleItems: SampleItem[] = [
  {
    id: 'item_1',
    title: 'Complete profile setup',
    description: 'Add your profile picture and bio information',
    category: 'onboarding',
    createdAt: '2024-10-01',
    completed: true,
  },
  {
    id: 'item_2',
    title: 'Enable two-factor authentication',
    description: 'Secure your account with an extra layer of protection',
    category: 'security',
    createdAt: '2024-10-02',
    completed: false,
  },
  {
    id: 'item_3',
    title: 'Connect social accounts',
    description: 'Link your Google or Apple account for faster login',
    category: 'account',
    createdAt: '2024-10-03',
    completed: false,
  },
  {
    id: 'item_4',
    title: 'Try dark mode',
    description: 'Switch to dark mode for a comfortable viewing experience',
    category: 'appearance',
    createdAt: '2024-10-04',
    completed: true,
  },
  {
    id: 'item_5',
    title: 'Explore offline features',
    description: 'Learn how the app works without internet connection',
    category: 'features',
    createdAt: '2024-10-05',
    completed: false,
  },
];

/**
 * Sample activity log entries
 */
export interface ActivityLogEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'login' | 'security' | 'profile' | 'settings';
  location?: string;
  device?: string;
}

export const sampleActivityLog: ActivityLogEntry[] = [
  {
    id: 'log_1',
    action: 'Login',
    description: 'Successful login via email',
    timestamp: '2024-10-10T09:30:00Z',
    type: 'login',
    location: 'San Francisco, CA',
    device: 'iPhone 14 Pro',
  },
  {
    id: 'log_2',
    action: '2FA Enabled',
    description: 'Two-factor authentication activated',
    timestamp: '2024-10-10T10:15:00Z',
    type: 'security',
    location: 'San Francisco, CA',
    device: 'iPhone 14 Pro',
  },
  {
    id: 'log_3',
    action: 'Profile Updated',
    description: 'Profile photo and bio updated',
    timestamp: '2024-10-10T11:00:00Z',
    type: 'profile',
    location: 'San Francisco, CA',
    device: 'iPhone 14 Pro',
  },
  {
    id: 'log_4',
    action: 'Password Changed',
    description: 'Account password was changed',
    timestamp: '2024-10-09T14:20:00Z',
    type: 'security',
    location: 'San Francisco, CA',
    device: 'iPhone 14 Pro',
  },
  {
    id: 'log_5',
    action: 'Settings Updated',
    description: 'Notification preferences changed',
    timestamp: '2024-10-08T16:45:00Z',
    type: 'settings',
    location: 'San Francisco, CA',
    device: 'iPhone 14 Pro',
  },
];

/**
 * Get sample data by type
 */
export function getSampleData<T>(type: 'users' | 'items' | 'activity'): T[] {
  switch (type) {
    case 'users':
      return sampleUsers as T[];
    case 'items':
      return sampleItems as T[];
    case 'activity':
      return sampleActivityLog as T[];
    default:
      return [];
  }
}
