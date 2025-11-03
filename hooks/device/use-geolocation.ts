/**
 * Geolocation Hook
 *
 * Tracks device location with permission handling.
 * Requires expo-location package (optional dependency).
 *
 * @module hooks/device/use-geolocation
 */

import { useEffect, useState } from 'react';

// Type definitions for expo-location (optional dependency)
interface LocationModule {
  requestForegroundPermissionsAsync: () => Promise<{ status: string }>;
  getCurrentPositionAsync: (options: { accuracy: number }) => Promise<LocationObject>;
  watchPositionAsync: (options: { accuracy: number; distanceInterval: number }, callback: (location: LocationObject) => void) => Promise<LocationSubscription>;
  Accuracy: {
    Lowest: number;
    Low: number;
    Balanced: number;
    High: number;
    Highest: number;
    BestForNavigation: number;
  };
}

interface LocationObject {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
}

interface LocationSubscription {
  remove: () => void;
}

/**
 * Location coordinates
 */
export interface LocationCoordinates {
  /** Latitude in degrees */
  latitude: number;
  /** Longitude in degrees */
  longitude: number;
  /** Altitude in meters (may be null) */
  altitude: number | null;
  /** Accuracy in meters */
  accuracy: number | null;
  /** Altitude accuracy in meters (may be null) */
  altitudeAccuracy: number | null;
  /** Heading in degrees (may be null) */
  heading: number | null;
  /** Speed in m/s (may be null) */
  speed: number | null;
}

/**
 * Geolocation state
 */
export interface GeolocationState {
  /** Current location coordinates */
  location: LocationCoordinates | null;
  /** Loading state */
  loading: boolean;
  /** Error message if unknown */
  error: string | null;
  /** Permission status */
  permission: 'granted' | 'denied' | 'undetermined';
}

/**
 * Configuration options for useGeolocation
 */
export interface UseGeolocationOptions {
  /**
   * Enable continuous location tracking
   * @default false
   */
  watch?: boolean;

  /**
   * Request high accuracy location
   * @default true
   */
  enableHighAccuracy?: boolean;

  /**
   * Enable the hook
   * @default true
   */
  enabled?: boolean;
}

/**
 * Tracks device geolocation
 *
 * Note: Requires expo-location to be installed:
 * `npx expo install expo-location`
 *
 * @param options - Configuration options
 * @returns Object containing location, loading state, _error, and permission status
 *
 * @example
 * // Basic location tracking
 * const { location, loading, _error, permission } = useGeolocation();
 *
 * {loading && <Text>Getting location...</Text>}
 * {error && <Text>Error: {error}</Text>}
 * {location && (
 *   <Text>
 *     Location: {location.latitude}, {location.longitude}
 *   </Text>
 * )}
 *
 * @example
 * // Continuous location tracking
 * const { location } = useGeolocation({ watch: true });
 *
 * useEffect(() => {
 *   if (location) {
 *     updateMapCenter(location.latitude, location.longitude);
 *   }
 * }, [location]);
 *
 * @example
 * // Permission handling
 * const { permission, location } = useGeolocation();
 *
 * {permission === 'denied' && (
 *   <Alert>
 *     Location permission denied. Please enable in settings.
 *   </Alert>
 * )}
 *
 * @example
 * // Conditional location tracking
 * const [trackingEnabled, setTrackingEnabled] = useState(false);
 * const { location } = useGeolocation({
 *   watch: true,
 *   enabled: trackingEnabled,
 * });
 */
export function useGeolocation(options: UseGeolocationOptions = {}): GeolocationState {
  const { watch = false, enableHighAccuracy = true, enabled = true } = options;

  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    permission: 'undetermined',
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let Location: LocationModule | null = null;
    let isMounted = true;
    let subscription: LocationSubscription | null = null;

    const loadLocation = async () => {
      try {
        // @ts-ignore - Optional dependency, may not be installed
        Location = (await import('expo-location')) as LocationModule;

        if (!isMounted || !Location) {
          return;
        }

        setState((prev) => ({ ...prev, loading: true }));

        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (!isMounted) {
          return;
        }

        if (status !== 'granted') {
          setState({
            location: null,
            loading: false,
            error: 'Location permission not granted',
            permission: 'denied',
          });
          return;
        }

        setState((prev) => ({ ...prev, permission: 'granted' }));

        if (watch) {
          // Watch position continuously
          subscription = await Location.watchPositionAsync(
            {
              accuracy: enableHighAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
              distanceInterval: 10, // Update every 10 meters
            },
            (loc: LocationObject) => {
              if (isMounted) {
                setState({
                  location: {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    altitude: loc.coords.altitude,
                    accuracy: loc.coords.accuracy,
                    altitudeAccuracy: loc.coords.altitudeAccuracy,
                    heading: loc.coords.heading,
                    speed: loc.coords.speed,
                  },
                  loading: false,
                  error: null,
                  permission: 'granted',
                });
              }
            }
          );
        } else {
          // Get current position once
          const loc = await Location.getCurrentPositionAsync({
            accuracy: enableHighAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
          });

          if (isMounted) {
            setState({
              location: {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                altitude: loc.coords.altitude,
                accuracy: loc.coords.accuracy,
                altitudeAccuracy: loc.coords.altitudeAccuracy,
                heading: loc.coords.heading,
                speed: loc.coords.speed,
              },
              loading: false,
              error: null,
              permission: 'granted',
            });
          }
        }
      } catch (_error: unknown) {
        if (isMounted) {
          setState({
            location: null,
            loading: false,
            error: _error instanceof Error ? _error.message : 'Location error',
            permission: 'denied',
          });
        }
      }
    };

    loadLocation();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.remove();
      }
    };
  }, [watch, enableHighAccuracy, enabled]);

  return state;
}
