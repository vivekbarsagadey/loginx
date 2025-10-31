/**
 * Feedback and Ratings Types
 *
 * Type definitions for user feedback, ratings, and issue reporting
 */

export type FeedbackCategory = 'bug' | 'feature' | 'improvement' | 'other' | 'rating';

export type FeedbackStatus = 'pending' | 'in-review' | 'resolved' | 'closed';

export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';

export type IssueType = 'crash' | 'performance' | 'ui-bug' | 'functionality' | 'security' | 'other';

export interface FeedbackSubmission {
  /** Unique identifier for the feedback */
  id: string;

  /** User ID who submitted the feedback */
  userId: string;

  /** User email for follow-up */
  userEmail?: string;

  /** Category of feedback */
  category: FeedbackCategory;

  /** Subject/title of the feedback */
  subject: string;

  /** Detailed feedback message */
  message: string;

  /** Star rating (1-5) if applicable */
  rating?: number;

  /** Issue type for bug reports */
  issueType?: IssueType;

  /** Screenshot or attachment URLs */
  attachments?: string[];

  /** Device information */
  deviceInfo: DeviceInfo;

  /** App version when feedback was submitted */
  appVersion: string;

  /** Current status of the feedback */
  status: FeedbackStatus;

  /** Priority level (set by admin) */
  priority?: FeedbackPriority;

  /** Timestamp when feedback was created */
  createdAt: Date;

  /** Timestamp when feedback was last updated */
  updatedAt: Date;

  /** Admin notes or response */
  adminNotes?: string;

  /** Whether user wants email updates */
  requestFollowUp: boolean;
}

export interface AppRating {
  /** Unique identifier for the rating */
  id: string;

  /** User ID who submitted the rating */
  userId: string;

  /** Star rating (1-5) */
  rating: number;

  /** Optional review text */
  review?: string;

  /** What the user likes most */
  likes?: string[];

  /** What could be improved */
  improvements?: string[];

  /** App version when rated */
  appVersion: string;

  /** Timestamp when rating was created */
  createdAt: Date;

  /** Timestamp when rating was updated */
  updatedAt?: Date;

  /** Whether user has been prompted to rate on store */
  promptedForStoreReview: boolean;

  /** Whether user completed store review */
  completedStoreReview?: boolean;
}

export interface DeviceInfo {
  /** Platform (ios, android, web) */
  platform: string;

  /** OS version */
  osVersion: string;

  /** Device model */
  deviceModel?: string;

  /** App version */
  appVersion: string;

  /** Build number */
  buildNumber?: string;

  /** Screen dimensions */
  screenSize?: {
    width: number;
    height: number;
  };

  /** Device locale */
  locale?: string;

  /** Time zone */
  timezone?: string;
}

export interface IssueReport extends FeedbackSubmission {
  /** Type of issue */
  issueType: IssueType;

  /** Steps to reproduce the issue */
  stepsToReproduce?: string;

  /** Expected behavior */
  expectedBehavior?: string;

  /** Actual behavior */
  actualBehavior?: string;

  /** Error message if unknown */
  errorMessage?: string;

  /** Stack trace if available */
  stackTrace?: string;

  /** Whether issue is reproducible */
  isReproducible?: boolean;
}

export interface FeedbackStats {
  /** Total feedback submissions */
  totalSubmissions: number;

  /** Average rating */
  averageRating: number;

  /** Rating distribution (1-5 stars) */
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };

  /** Feedback by category */
  byCategory: {
    bug: number;
    feature: number;
    improvement: number;
    rating: number;
    other: number;
  };

  /** Feedback by status */
  byStatus: {
    pending: number;
    'in-review': number;
    resolved: number;
    closed: number;
  };

  /** Most recent feedback */
  recentFeedback: FeedbackSubmission[];
}

export interface FeedbackFilters {
  /** Filter by category */
  category?: FeedbackCategory;

  /** Filter by status */
  status?: FeedbackStatus;

  /** Filter by priority */
  priority?: FeedbackPriority;

  /** Filter by rating range */
  ratingRange?: {
    min: number;
    max: number;
  };

  /** Filter by date range */
  dateRange?: {
    start: Date;
    end: Date;
  };

  /** Filter by user */
  userId?: string;

  /** Search query */
  searchQuery?: string;
}
