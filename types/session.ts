/**
 * Session type definitions
 */

export interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  ipAddress: string;
  isCurrent: boolean;
}
