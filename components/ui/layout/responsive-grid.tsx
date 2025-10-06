/**
 * Responsive Grid Component
 *
 * A flexible grid layout that automatically adjusts the number of columns
 * based on screen size and orientation.
 *
 * Features:
 * - Automatic column calculation based on screen width
 * - Customizable column counts per breakpoint
 * - Responsive gap spacing
 * - Support for variable item heights
 *
 * @example
 * ```tsx
 * <ResponsiveGrid>
 *   {items.map(item => (
 *     <Card key={item.id}>{item.content}</Card>
 *   ))}
 * </ResponsiveGrid>
 * ```
 */

import { useResponsive, useResponsiveSpacing } from '@/hooks/use-responsive';
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export interface ResponsiveGridProps {
  /** Child components to render in grid */
  children: ReactNode;

  /** Override columns for specific breakpoints */
  columns?: {
    small?: number;
    medium?: number;
    large?: number;
    xlarge?: number;
  };

  /** Gap between items (uses responsive spacing) */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /** Additional styles for container */
  style?: ViewStyle;

  /** Additional styles for items */
  itemStyle?: ViewStyle;

  /** Minimum item width (items won't shrink below this) */
  minItemWidth?: number;

  /** Test ID for testing */
  testID?: string;
}

/**
 * Responsive grid that adapts to screen size and orientation
 */
export function ResponsiveGrid({ children, columns, gap = 'md', style, itemStyle, minItemWidth, testID }: ResponsiveGridProps) {
  const { gridColumns, width, breakpoints } = useResponsive();
  const spacing = useResponsiveSpacing();

  // Determine number of columns based on breakpoints
  const getColumnCount = () => {
    if (columns) {
      if (width >= breakpoints.xlarge && columns.xlarge) {
        return columns.xlarge;
      }
      if (width >= breakpoints.large && columns.large) {
        return columns.large;
      }
      if (width >= breakpoints.medium && columns.medium) {
        return columns.medium;
      }
      if (width >= breakpoints.small && columns.small) {
        return columns.small;
      }
    }

    // If minItemWidth is specified, calculate columns based on that
    if (minItemWidth) {
      const gapSize = spacing[gap];
      const availableWidth = width - spacing.responsive * 2; // Account for container padding
      const itemsPerRow = Math.floor((availableWidth + gapSize) / (minItemWidth + gapSize));
      return Math.max(1, itemsPerRow);
    }

    // Otherwise use default responsive columns
    return gridColumns;
  };

  const columnCount = getColumnCount();
  const gapSize = spacing[gap];

  // Convert children to array
  const childArray = React.Children.toArray(children);

  // Split children into rows
  const rows: ReactNode[][] = [];
  for (let i = 0; i < childArray.length; i += columnCount) {
    rows.push(childArray.slice(i, i + columnCount));
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, { gap: gapSize }]}>
          {row.map((child, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.item,
                {
                  flex: 1,
                  maxWidth: `${100 / columnCount}%`,
                },
                itemStyle,
              ]}
            >
              {child}
            </View>
          ))}

          {/* Add empty cells to maintain grid alignment */}
          {row.length < columnCount &&
            Array.from({ length: columnCount - row.length }).map((_, index) => (
              <View
                key={`empty-${index}`}
                style={[
                  styles.item,
                  {
                    flex: 1,
                    maxWidth: `${100 / columnCount}%`,
                  },
                ]}
              />
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 0, // Gap is handled by gap property
  },
  item: {
    minWidth: 0, // Prevent flex items from overflowing
  },
  stackContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  stackItem: {
    width: '100%',
  },
  columnItem: {
    flex: 1,
    minWidth: 0,
  },
});

/**
 * Simple two-column responsive layout
 * Stacks vertically on small screens, side-by-side on larger screens
 */
export interface ResponsiveTwoColumnProps {
  /** Left column content */
  left: ReactNode;

  /** Right column content */
  right: ReactNode;

  /** Breakpoint at which to switch to side-by-side layout */
  breakpoint?: 'small' | 'medium' | 'large';

  /** Gap between columns */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /** Additional styles */
  style?: ViewStyle;
}

export function ResponsiveTwoColumn({ left, right, breakpoint = 'medium', gap = 'md', style }: ResponsiveTwoColumnProps) {
  const { isAbove } = useResponsive();
  const spacing = useResponsiveSpacing();

  const shouldStack = !isAbove(breakpoint);
  const gapSize = spacing[gap];

  if (shouldStack) {
    return (
      <View style={[styles.stackContainer, { gap: gapSize }, style]}>
        <View style={styles.stackItem}>{left}</View>
        <View style={styles.stackItem}>{right}</View>
      </View>
    );
  }

  return (
    <View style={[styles.rowContainer, { gap: gapSize }, style]}>
      <View style={styles.columnItem}>{left}</View>
      <View style={styles.columnItem}>{right}</View>
    </View>
  );
}
