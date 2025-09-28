
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
}
