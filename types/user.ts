export interface UserProfile {
  displayName: string;
  email: string;
  age: number;
  photoURL: string;
  pushEnabled: boolean;
  emailUpdates: boolean;
  marketingTips: boolean;
  expoPushToken?: string;
  deleted?: boolean;
  deletedAt?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  referralCode?: string;
  termsAcceptedAt?: string;
}
