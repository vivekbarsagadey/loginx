import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export interface SearchBarProps {
  /** Current search value */
  value: string;
  /** Called when search value changes */
  onChangeText: (text: string) => void;
  /** Called when search is submitted */
  onSubmit?: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Loading state */
  loading?: boolean;
  /** Debounce delay in ms */
  debounce?: number;
  /** Show recent searches */
  showRecent?: boolean;
  /** Recent search items */
  recentSearches?: string[];
  /** Called when recent search is selected */
  onRecentSelect?: (search: string) => void;
  /** Called when recent search is removed */
  onRecentRemove?: (search: string) => void;
  /** Show suggestions */
  showSuggestions?: boolean;
  /** Suggestion items */
  suggestions?: string[];
  /** Called when suggestion is selected */
  onSuggestionSelect?: (suggestion: string) => void;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search...',
  loading = false,
  debounce = 300,
  showRecent = false,
  recentSearches = [],
  onRecentSelect,
  onRecentRemove,
  showSuggestions = false,
  suggestions = [],
  onSuggestionSelect,
  autoFocus = false,
  accessibilityLabel,
}: SearchBarProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');
  const surfaceColor = useThemeColor({}, 'surface');

  const [isFocused, setIsFocused] = useState(false);

  // Debounce effect (for future use)
  useEffect(() => {
    const handler = setTimeout(() => {
      // Can be used for triggering search after delay
    }, debounce);

    return () => clearTimeout(handler);
  }, [value, debounce]);

  const handleClear = () => {
    onChangeText('');
  };

  const handleSubmit = () => {
    onSubmit?.(value);
    setIsFocused(false);
  };

  const handleRecentSelect = (search: string) => {
    onChangeText(search);
    onRecentSelect?.(search);
    setIsFocused(false);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    onChangeText(suggestion);
    onSuggestionSelect?.(suggestion);
    setIsFocused(false);
  };

  const showRecentList = showRecent && isFocused && !value && recentSearches.length > 0;
  const showSuggestionList = showSuggestions && isFocused && value && suggestions.length > 0;

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: surfaceColor,
            borderColor: isFocused ? primaryColor : borderColor,
          },
        ]}
      >
        {/* Search Icon */}
        <ThemedText style={[styles.searchIcon, { color: secondaryTextColor }]}>🔍</ThemedText>

        {/* Input */}
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          placeholderTextColor={secondaryTextColor}
          returnKeyType="search"
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          accessible={true}
          accessibilityRole="search"
          accessibilityLabel={accessibilityLabel || 'Search input'}
        />

        {/* Loading Indicator */}
        {loading && <ActivityIndicator size="small" color={primaryColor} style={styles.loader} />}

        {/* Clear Button */}
        {value.length > 0 && !loading && (
          <Pressable onPress={handleClear} style={styles.clearButton} hitSlop={8} accessible={true} accessibilityRole="button" accessibilityLabel="Clear search">
            <ThemedText style={[styles.clearIcon, { color: secondaryTextColor }]}>✕</ThemedText>
          </Pressable>
        )}
      </View>

      {/* Recent Searches */}
      {showRecentList && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <View style={styles.dropdownHeader}>
            <ThemedText type="label" style={{ color: secondaryTextColor }}>
              RECENT SEARCHES
            </ThemedText>
          </View>
          <ScrollView style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
            {recentSearches.map((search, index) => (
              <View key={index} style={[styles.dropdownItem, { borderBottomColor: borderColor }]}>
                <Pressable style={styles.dropdownItemContent} onPress={() => handleRecentSelect(search)} accessible={true} accessibilityRole="button" accessibilityLabel={`Recent search: ${search}`}>
                  <ThemedText style={[styles.dropdownIcon, { color: secondaryTextColor }]}>🕐</ThemedText>
                  <ThemedText style={[styles.dropdownText, { color: textColor }]}>{search}</ThemedText>
                </Pressable>
                {onRecentRemove && (
                  <Pressable onPress={() => onRecentRemove(search)} style={styles.removeButton} hitSlop={8} accessible={true} accessibilityRole="button" accessibilityLabel={`Remove ${search}`}>
                    <ThemedText style={[styles.removeIcon, { color: secondaryTextColor }]}>✕</ThemedText>
                  </Pressable>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Suggestions */}
      {showSuggestionList && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <ScrollView style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={index}
                style={[styles.dropdownItem, { borderBottomColor: borderColor }]}
                onPress={() => handleSuggestionSelect(suggestion)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Suggestion: ${suggestion}`}
              >
                <ThemedText style={[styles.dropdownIcon, { color: secondaryTextColor }]}>🔍</ThemedText>
                <ThemedText style={[styles.dropdownText, { color: textColor }]}>{suggestion}</ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    padding: Spacing.xs,
  },
  clearIcon: {
    fontSize: 18,
  },
  container: {
    position: 'relative',
    zIndex: 1,
  },
  dropdown: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.xs,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  dropdownHeader: {
    borderBottomWidth: 1,
    padding: Spacing.sm,
  },
  dropdownIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  dropdownItem: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dropdownItemContent: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  dropdownScroll: {
    maxHeight: 250,
  },
  dropdownText: {
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.sm,
  },
  loader: {
    marginLeft: Spacing.sm,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  removeIcon: {
    fontSize: 16,
  },
  searchContainer: {
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
});
