/**
 * @module components/monitoring/monitoring-dashboard
 * @description Monitoring dashboard showing key performance metrics
 * TASK-112: Create monitoring dashboard showing key metrics
 */

import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { createLogger } from '@/utils/debug';
import { getPerformanceMetrics, type PerformanceMetrics } from '@/utils/monitoring';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

const logger = createLogger('MonitoringDashboard');

/**
 * Monitoring Dashboard Component
 * Displays real-time performance metrics and health indicators
 */
export function MonitoringDashboard() {
  const colors = useThemeColors();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    syncQueueSize: 0,
    cacheHitRate: 0,
    errorCount: 0,
    avgResponseTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadMetrics = async () => {
    try {
      const newMetrics = await getPerformanceMetrics();
      setMetrics(newMetrics);
      setLastUpdate(new Date());
    } catch (_error: unknown) {
      logger._error('Failed to load metrics:', _error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMetrics();
    setRefreshing(false);
  };

  useEffect(() => {
    loadMetrics();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Performance Dashboard</ThemedText>
        <ThemedText type="caption" style={styles.lastUpdate}>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </ThemedText>
      </ThemedView>

      <View style={styles.metricsGrid}>
        <MetricCard title="Sync Queue" value={metrics.syncQueueSize.toString()} unit="items" status={getQueueStatus(metrics.syncQueueSize)} colors={colors} />

        <MetricCard title="Cache Hit Rate" value={(metrics.cacheHitRate * 100).toFixed(1)} unit="%" status={getCacheStatus(metrics.cacheHitRate)} colors={colors} />

        <MetricCard title="Error Count" value={metrics.errorCount.toString()} unit="errors" status={getErrorStatus(metrics.errorCount)} colors={colors} />

        <MetricCard title="Avg Response" value={metrics.avgResponseTime.toFixed(0)} unit="ms" status={getResponseTimeStatus(metrics.avgResponseTime)} colors={colors} />
      </View>

      <ThemedView style={styles.actions}>
        <ThemedButton
          title="Clear Cache"
          onPress={async () => {
            const { clear } = await import('@/utils/cache');
            await clear();
            await loadMetrics();
          }}
          variant="secondary"
        />

        <ThemedButton
          title="Force Sync"
          onPress={async () => {
            const { forceSyncAll } = await import('@/utils/local-first');
            await forceSyncAll();
            await loadMetrics();
          }}
          variant="secondary"
        />
      </ThemedView>
    </ScrollView>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  colors: ReturnType<typeof useThemeColors>;
}

function MetricCard({ title, value, unit, status, colors }: MetricCardProps) {
  const statusColors = {
    good: colors.success,
    warning: '#FFA500',
    critical: colors.error,
  };

  return (
    <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
      <ThemedText type="caption" style={styles.metricTitle}>
        {title}
      </ThemedText>
      <View style={styles.metricValue}>
        <ThemedText type="title" style={{ color: statusColors[status] }}>
          {value}
        </ThemedText>
        <ThemedText type="caption" style={styles.metricUnit}>
          {unit}
        </ThemedText>
      </View>
      <View style={[styles.statusIndicator, { backgroundColor: statusColors[status] }]} />
    </View>
  );
}

function getQueueStatus(size: number): 'good' | 'warning' | 'critical' {
  if (size === 0) {
    return 'good';
  }
  if (size < 50) {
    return 'warning';
  }
  return 'critical';
}

function getCacheStatus(hitRate: number): 'good' | 'warning' | 'critical' {
  if (hitRate >= 0.8) {
    return 'good';
  }
  if (hitRate >= 0.5) {
    return 'warning';
  }
  return 'critical';
}

function getErrorStatus(count: number): 'good' | 'warning' | 'critical' {
  if (count === 0) {
    return 'good';
  }
  if (count < 10) {
    return 'warning';
  }
  return 'critical';
}

function getResponseTimeStatus(time: number): 'good' | 'warning' | 'critical' {
  if (time < 500) {
    return 'good';
  }
  if (time < 2000) {
    return 'warning';
  }
  return 'critical';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  lastUpdate: {
    marginTop: 8,
    opacity: 0.6,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    position: 'relative',
  },
  metricTitle: {
    marginBottom: 8,
    opacity: 0.7,
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricUnit: {
    opacity: 0.5,
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actions: {
    gap: 12,
  },
});
