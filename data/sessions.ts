/**
 * Session data and configuration
 */

import type { Session } from '@/types/session';

/**
 * Get mock sessions for demo/development
 * In production, this would fetch from an API
 */
export function getMockSessions(): Session[] {
  return [
    {
      id: '1',
      device: 'iPhone 15 Pro',
      location: 'San Francisco, CA',
      lastActive: 'Active now',
      ipAddress: '192.168.1.1',
      isCurrent: true,
    },
    {
      id: '2',
      device: 'MacBook Pro',
      location: 'New York, NY',
      lastActive: '1 hour ago',
      ipAddress: '192.168.1.101',
      isCurrent: false,
    },
    {
      id: '3',
      device: 'Chrome on Windows',
      location: 'Los Angeles, CA',
      lastActive: '2 days ago',
      ipAddress: '203.45.67.89',
      isCurrent: false,
    },
  ];
}
