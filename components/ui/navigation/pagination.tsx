import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export interface PaginationProps {
  /** Total number of pages */
  totalPages: number;
  /** Current page (1-indexed) */
  currentPage: number;
  /** Called when page changes */
  onPageChange: (page: number) => void;
  /** Show first/last buttons */
  showFirstLast?: boolean;
  /** Show page numbers */
  showPageNumbers?: boolean;
  /** Maximum page numbers to show */
  maxPageNumbers?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Pagination({ totalPages, currentPage, onPageChange, showFirstLast = true, showPageNumbers = true, maxPageNumbers = 5, disabled = false, accessibilityLabel }: PaginationProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  const handlePageChange = (page: number) => {
    if (!disabled && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfMax = Math.floor(maxPageNumbers / 2);

    let start = Math.max(1, currentPage - halfMax);
    const end = Math.min(totalPages, start + maxPageNumbers - 1);

    if (end - start < maxPageNumbers - 1) {
      start = Math.max(1, end - maxPageNumbers + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = showPageNumbers ? getPageNumbers() : [];

  return (
    <View style={styles.container} accessible={true} accessibilityLabel={accessibilityLabel || `Page ${currentPage} of ${totalPages}`}>
      {showFirstLast && (
        <Pressable
          onPress={() => {
            handlePageChange(1);
          }}
          disabled={disabled || currentPage === 1}
          style={[styles.button, { borderColor }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="First page"
        >
          <ThemedText style={[styles.buttonText, { color: textColor }]}>««</ThemedText>
        </Pressable>
      )}

      <Pressable
        onPress={() => {
          handlePageChange(currentPage - 1);
        }}
        disabled={disabled || currentPage === 1}
        style={[styles.button, { borderColor }]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Previous page"
      >
        <ThemedText style={[styles.buttonText, { color: textColor }]}>‹</ThemedText>
      </Pressable>

      {showPageNumbers &&
        pages.map((page, index) => {
          if (page === '...') {
            return (
              <View key={`ellipsis-${index}`} style={styles.ellipsis}>
                <ThemedText style={{ color: textColor }}>...</ThemedText>
              </View>
            );
          }

          const isActive = page === currentPage;

          return (
            <Pressable
              key={page}
              onPress={() => {
                handlePageChange(page as number);
              }}
              disabled={disabled}
              style={[
                styles.button,
                {
                  backgroundColor: isActive ? primaryColor : backgroundColor,
                  borderColor: isActive ? primaryColor : borderColor,
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Page ${page}`}
              accessibilityState={{ selected: isActive }}
            >
              <ThemedText
                style={[
                  styles.buttonText,
                  {
                    color: isActive ? backgroundColor : textColor,
                  },
                ]}
              >
                {page}
              </ThemedText>
            </Pressable>
          );
        })}

      <Pressable
        onPress={() => {
          handlePageChange(currentPage + 1);
        }}
        disabled={disabled || currentPage === totalPages}
        style={[styles.button, { borderColor }]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Next page"
      >
        <ThemedText style={[styles.buttonText, { color: textColor }]}>›</ThemedText>
      </Pressable>

      {showFirstLast && (
        <Pressable
          onPress={() => {
            handlePageChange(totalPages);
          }}
          disabled={disabled || currentPage === totalPages}
          style={[styles.button, { borderColor }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Last page"
        >
          <ThemedText style={[styles.buttonText, { color: textColor }]}>»»</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    minWidth: 36,
    paddingHorizontal: Spacing.sm,
  },
  buttonText: {
    fontWeight: '500',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  ellipsis: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    minWidth: 36,
  },
});
