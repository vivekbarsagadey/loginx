/**
 * Feedback Actions
 *
 * Actions for submitting and managing user feedback and ratings
 */

import { firestore as db } from '@/firebase-config';
import type { AppRating, DeviceInfo, FeedbackSubmission, IssueReport } from '@/types/feedback';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Localization from 'expo-localization';
import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { Dimensions, Platform } from 'react-native';

/**
 * Get device information for feedback submission
 */
export function getDeviceInfo(): DeviceInfo {
  const { width, height } = Dimensions.get('window');

  return {
    platform: Platform.OS,
    osVersion: Device.osVersion || 'Unknown',
    deviceModel: Device.modelName || Device.deviceName || 'Unknown',
    appVersion: Constants.expoConfig?.version || '1.0.0',
    buildNumber: Constants.expoConfig?.extra?.buildNumber,
    screenSize: { width, height },
    locale: Localization.getLocales()[0]?.languageCode || 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

/**
 * Submit user feedback
 */
export async function submitFeedback(
  userId: string,
  userEmail: string | undefined,
  category: FeedbackSubmission['category'],
  subject: string,
  message: string,
  rating?: number,
  requestFollowUp = false
): Promise<{ success: boolean; feedbackId?: string; error?: string }> {
  try {
    if (!subject.trim() || !message.trim()) {
      return { success: false, error: 'Subject and message are required' };
    }

    if (message.trim().length < 10) {
      return { success: false, error: 'Message must be at least 10 characters' };
    }

    const deviceInfo = getDeviceInfo();

    const feedbackData: Omit<FeedbackSubmission, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      userEmail,
      category,
      subject: subject.trim(),
      message: message.trim(),
      rating,
      deviceInfo,
      appVersion: deviceInfo.appVersion,
      status: 'pending',
      requestFollowUp,
    };

    const feedbackRef = await addDoc(collection(db, 'feedback'), {
      ...feedbackData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error: unknown) {
    // Error already logged by Firebase, return user-friendly message
    return { success: false, error: 'Failed to submit feedback. Please try again.' };
  }
}

/**
 * Submit app rating
 */
export async function submitRating(userId: string, rating: number, review?: string, likes?: string[], improvements?: string[]): Promise<{ success: boolean; ratingId?: string; error?: string }> {
  try {
    if (rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5' };
    }

    const deviceInfo = getDeviceInfo();

    const ratingData: Omit<AppRating, 'id' | 'createdAt'> = {
      userId,
      rating,
      review,
      likes,
      improvements,
      appVersion: deviceInfo.appVersion,
      promptedForStoreReview: false,
    };

    const ratingRef = await addDoc(collection(db, 'ratings'), {
      ...ratingData,
      createdAt: serverTimestamp(),
    });

    return { success: true, ratingId: ratingRef.id };
  } catch (error: unknown) {
    return { success: false, error: 'Failed to submit rating. Please try again.' };
  }
}

/**
 * Submit issue report
 */
export async function submitIssueReport(
  userId: string,
  userEmail: string | undefined,
  issueType: IssueReport['issueType'],
  subject: string,
  message: string,
  stepsToReproduce?: string,
  expectedBehavior?: string,
  actualBehavior?: string,
  errorMessage?: string
): Promise<{ success: boolean; issueId?: string; error?: string }> {
  try {
    if (!subject.trim() || !message.trim()) {
      return { success: false, error: 'Subject and message are required' };
    }

    const deviceInfo = getDeviceInfo();

    const issueData: Omit<IssueReport, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      userEmail,
      category: 'bug',
      subject: subject.trim(),
      message: message.trim(),
      issueType,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      errorMessage,
      deviceInfo,
      appVersion: deviceInfo.appVersion,
      status: 'pending',
      priority: issueType === 'crash' || issueType === 'security' ? 'high' : 'medium',
      requestFollowUp: true,
    };

    const issueRef = await addDoc(collection(db, 'issues'), {
      ...issueData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, issueId: issueRef.id };
  } catch (error: unknown) {
    return { success: false, error: 'Failed to submit issue report. Please try again.' };
  }
}

/**
 * Get user's feedback history
 */
export async function getUserFeedback(userId: string, limitCount = 10): Promise<{ success: boolean; feedback?: FeedbackSubmission[]; error?: string }> {
  try {
    const q = query(collection(db, 'feedback'), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(limitCount));

    const querySnapshot = await getDocs(q);

    const feedback: FeedbackSubmission[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as FeedbackSubmission[];

    return { success: true, feedback };
  } catch (error: unknown) {
    return { success: false, error: 'Failed to fetch feedback. Please try again.' };
  }
}

/**
 * Get user's rating history
 */
export async function getUserRatings(userId: string): Promise<{ success: boolean; ratings?: AppRating[]; error?: string }> {
  try {
    const q = query(collection(db, 'ratings'), where('userId', '==', userId), orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);

    const ratings: AppRating[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as AppRating[];

    return { success: true, ratings };
  } catch (error: unknown) {
    return { success: false, error: 'Failed to fetch rating history' };
  }
}

/**
 * Update feedback status (admin only)
 */
export async function updateFeedbackStatus(feedbackId: string, status: FeedbackSubmission['status'], adminNotes?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const feedbackRef = doc(db, 'feedback', feedbackId);

    await updateDoc(feedbackRef, {
      status,
      adminNotes,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: 'Failed to update feedback status' };
  }
}

/**
 * Check if user has submitted feedback recently (to prevent spam)
 */
export async function checkRecentFeedback(userId: string, withinMinutes = 5): Promise<boolean> {
  try {
    const cutoffTime = new Date(Date.now() - withinMinutes * 60 * 1000);

    const q = query(collection(db, 'feedback'), where('userId', '==', userId), where('createdAt', '>=', cutoffTime), limit(1));

    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error: unknown) {
    return false;
  }
}

/**
 * Get app's average rating
 */
export async function getAverageRating(): Promise<{ averageRating: number; totalRatings: number }> {
  try {
    const querySnapshot = await getDocs(collection(db, 'ratings'));

    let totalRating = 0;
    let count = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.rating) {
        totalRating += data.rating;
        count++;
      }
    });

    const averageRating = count > 0 ? totalRating / count : 0;

    return { averageRating, totalRatings: count };
  } catch (error: unknown) {
    return { averageRating: 0, totalRatings: 0 };
  }
}
