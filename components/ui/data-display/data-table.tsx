import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export interface DataTableColumn<T> {
  /** Column key matching data object key */
  key: keyof T;
  /** Column header label */
  label: string;
  /** Column width (flex value or fixed width) */
  width?: number;
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Custom render function for cell content */
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  /** Array of data items to display */
  data: T[];
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Unique key extractor */
  keyExtractor: (item: T) => string;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row keys */
  selectedKeys?: string[];
  /** Called when selection changes */
  onSelectionChange?: (keys: string[]) => void;
  /** Called when row is pressed */
  onRowPress?: (item: T) => void;
  /** Enable pagination */
  paginated?: boolean;
  /** Items per page */
  pageSize?: number;
  /** Current page (1-indexed) */
  currentPage?: number;
  /** Called when page changes */
  onPageChange?: (page: number) => void;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  onRowPress,
  paginated = false,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  accessibilityLabel,
}: DataTableProps<T>) {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const surfaceColor = useThemeColor({}, 'surface');

  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle sorting
  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) {
      return;
    }

    if (sortColumn === column.key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column.key);
      setSortDirection('asc');
    }
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) {
      return 0;
    }

    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (aVal === bVal) {
      return 0;
    }

    const comparison = aVal > bVal ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Paginate data
  const paginatedData = paginated ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize) : sortedData;

  const totalPages = paginated ? Math.ceil(data.length / pageSize) : 1;

  // Handle row selection
  const handleRowSelect = (key: string) => {
    if (!selectable || !onSelectionChange) {
      return;
    }

    const newSelection = selectedKeys.includes(key) ? selectedKeys.filter((k) => k !== key) : [...selectedKeys, key];

    onSelectionChange(newSelection);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!selectable || !onSelectionChange) {
      return;
    }

    const allKeys = paginatedData.map(keyExtractor);
    const allSelected = allKeys.every((k) => selectedKeys.includes(k));

    if (allSelected) {
      onSelectionChange(selectedKeys.filter((k) => !allKeys.includes(k)));
    } else {
      onSelectionChange([...new Set([...selectedKeys, ...allKeys])]);
    }
  };

  const allCurrentSelected = selectable && paginatedData.length > 0 && paginatedData.every((item) => selectedKeys.includes(keyExtractor(item)));

  return (
    <View style={styles.container} accessible={true} accessibilityLabel={accessibilityLabel || 'Data table'}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.row, styles.headerRow, { borderBottomColor: borderColor }]}>
            {selectable && (
              <Pressable style={[styles.cell, styles.checkboxCell]} onPress={handleSelectAll} accessible={true} accessibilityRole="checkbox" accessibilityState={{ checked: allCurrentSelected }}>
                <View style={[styles.checkbox, { borderColor }, allCurrentSelected && { backgroundColor: primaryColor, borderColor: primaryColor }]}>
                  {allCurrentSelected && <ThemedText style={[styles.checkmark, { color: surfaceColor }]}>✓</ThemedText>}
                </View>
              </Pressable>
            )}

            {columns.map((column) => (
              <Pressable
                key={String(column.key)}
                style={[styles.cell, styles.headerCell, column.width ? { flex: column.width } : undefined]}
                onPress={() => handleSort(column)}
                disabled={!column.sortable}
                accessible={true}
                accessibilityRole="button"
              >
                <ThemedText type="label" style={[styles.headerText, { color: textColor }]}>
                  {column.label}
                </ThemedText>
                {column.sortable && sortColumn === column.key && <ThemedText style={[styles.sortIcon, { color: primaryColor }]}>{sortDirection === 'asc' ? '↑' : '↓'}</ThemedText>}
              </Pressable>
            ))}
          </View>

          {/* Data Rows */}
          {paginatedData.map((item) => {
            const key = keyExtractor(item);
            const isSelected = selectedKeys.includes(key);

            return (
              <Pressable
                key={key}
                style={[styles.row, { borderBottomColor: borderColor }, isSelected && { backgroundColor: `${primaryColor}10` }]}
                onPress={() => onRowPress?.(item)}
                accessible={true}
                accessibilityRole="button"
              >
                {selectable && (
                  <Pressable
                    style={[styles.cell, styles.checkboxCell]}
                    onPress={() => handleRowSelect(key)}
                    accessible={true}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                  >
                    <View style={[styles.checkbox, { borderColor }, isSelected && { backgroundColor: primaryColor, borderColor: primaryColor }]}>
                      {isSelected && <ThemedText style={[styles.checkmark, { color: surfaceColor }]}>✓</ThemedText>}
                    </View>
                  </Pressable>
                )}

                {columns.map((column) => (
                  <View key={String(column.key)} style={[styles.cell, column.width ? { flex: column.width } : undefined]} accessible={true}>
                    {column.render ? (
                      column.render(item[column.key], item)
                    ) : (
                      <ThemedText style={{ color: textColor }} numberOfLines={2}>
                        {String(item[column.key] ?? '')}
                      </ThemedText>
                    )}
                  </View>
                ))}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Pagination */}
      {paginated && (
        <View style={[styles.pagination, { borderTopColor: borderColor }]}>
          <ThemedText type="caption" style={{ color: textColor }}>
            Page {currentPage} of {totalPages} ({data.length} total)
          </ThemedText>
          <View style={styles.paginationButtons}>
            <Pressable
              style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
              onPress={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Previous page"
            >
              <ThemedText style={{ color: currentPage === 1 ? borderColor : primaryColor }}>Previous</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
              onPress={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Next page"
            >
              <ThemedText style={{ color: currentPage === totalPages ? borderColor : primaryColor }}>Next</ThemedText>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 100,
    padding: Spacing.md,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: BorderRadius.xs,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  checkboxCell: {
    alignItems: 'center',
    flex: 0,
    minWidth: 50,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '700',
  },
  container: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  headerCell: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  headerRow: {
    borderBottomWidth: 2,
  },
  headerText: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  pageButton: {
    padding: Spacing.sm,
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pagination: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  paginationButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  row: {
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  sortIcon: {
    fontSize: 16,
  },
  table: {
    minWidth: '100%',
  },
});
