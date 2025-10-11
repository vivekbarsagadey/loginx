import { ThemedText } from '@/components/themed-text';\nimport { BorderRadius, Spacing } from '@/constants/layout';\nimport { useThemeColors } from '@/hooks/use-theme-colors';\nimport React, { useEffect, useState } from 'react';\nimport { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';\n\nexport interface SearchBarProps {\n  /** Current search value */\n  value: string;\n  /** Called when search value changes */\n  onChangeText: (text: string) => void;\n  /** Called when search is submitted */\n  onSubmit?: (text: string) => void;\n  /** Placeholder text */\n  placeholder?: string;\n  /** Loading state */\n  loading?: boolean;\n  /** Debounce delay in ms */\n  debounce?: number;\n  /** Show recent searches */\n  showRecent?: boolean;\n  /** Recent search items */\n  recentSearches?: string[];\n  /** Called when recent search is selected */\n  onRecentSelect?: (search: string) => void;\n  /** Called when recent search is removed */\n  onRecentRemove?: (search: string) => void;\n  /** Show suggestions */\n  showSuggestions?: boolean;\n  /** Suggestion items */\n  suggestions?: string[];\n  /** Called when suggestion is selected */\n  onSuggestionSelect?: (suggestion: string) => void;\n  /** Auto-focus on mount */\n  autoFocus?: boolean;\n  /** Accessibility label */\n  accessibilityLabel?: string;\n}\n\nexport function SearchBar({\n  value,\n  onChangeText,\n  onSubmit,\n  placeholder = 'Search...',\n  loading = false,\n  debounce = 300,\n  showRecent = false,\n  recentSearches = [],\n  onRecentSelect,\n  onRecentRemove,\n  showSuggestions = false,\n  suggestions = [],\n  onSuggestionSelect,\n  autoFocus = false,\n  accessibilityLabel,\n}: SearchBarProps) {\n  const colors = useThemeColors();

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
            backgroundColor: colors.surface,
            borderColor: isFocused ? colors.primary : colors.border,
          },
        ]}
      >
        {/* Search Icon */}
        <ThemedText style={[styles.searchIcon, { color: colors['text-muted'] }]}>🔍</ThemedText>

        {/* Input */}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          placeholderTextColor={colors['text-muted']}
          returnKeyType="search"
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          accessible={true}
          accessibilityRole="search"
          accessibilityLabel={accessibilityLabel || 'Search input'}
        />

        {/* Loading Indicator */}
        {loading && <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />}

        {/* Clear Button */}
        {value.length > 0 && !loading && (
          <Pressable onPress={handleClear} style={styles.clearButton} hitSlop={8} accessible={true} accessibilityRole="button" accessibilityLabel="Clear search">
            <ThemedText style={[styles.clearIcon, { color: colors['text-muted'] }]}>✕</ThemedText>
          </Pressable>
        )}
      </View>

      {/* Recent Searches */}
      {showRecentList && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View style={styles.dropdownHeader}>
            <ThemedText type="label" style={{ color: colors['text-muted'] }}>
              RECENT SEARCHES
            </ThemedText>
          </View>
          <ScrollView style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
            {recentSearches.map((search, index) => (
              <View key={index} style={[styles.dropdownItem, { borderBottomColor: colors.border }]}>
                <Pressable style={styles.dropdownItemContent} onPress={() => handleRecentSelect(search)} accessible={true} accessibilityRole="button" accessibilityLabel={`Recent search: ${search}`}>
                  <ThemedText style={[styles.dropdownIcon, { color: colors['text-muted'] }]}>🕐</ThemedText>
                  <ThemedText style={[styles.dropdownText, { color: colors.text }]}>{search}</ThemedText>
                </Pressable>
                {onRecentRemove && (
                  <Pressable onPress={() => onRecentRemove(search)} style={styles.removeButton} hitSlop={8} accessible={true} accessibilityRole="button" accessibilityLabel={`Remove ${search}`}>
                    <ThemedText style={[styles.removeIcon, { color: colors['text-muted'] }]}>✕</ThemedText>
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
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <ScrollView style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={index}
                style={[styles.dropdownItem, { borderBottomColor: colors.border }]}
                onPress={() => handleSuggestionSelect(suggestion)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Suggestion: ${suggestion}`}
              >
                <ThemedText style={[styles.dropdownIcon, { color: colors['text-muted'] }]}>🔍</ThemedText>
                <ThemedText style={[styles.dropdownText, { color: colors.text }]}>{suggestion}</ThemedText>
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
    padding: Spacing.sm,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    fontSize: 18,
    lineHeight: 18,
  },
  container: {
    position: 'relative',
    zIndex: 1,
  },
  dropdown: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.sm,
    maxHeight: 300,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: Spacing.md,
  },
  dropdownIcon: {
    fontSize: 18,
    marginRight: Spacing.md,
  },
  dropdownItem: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
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
    lineHeight: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.md,
    lineHeight: 22,
  },
  loader: {
    marginLeft: Spacing.sm,
  },
  removeButton: {
    padding: Spacing.sm,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    fontSize: 16,
    lineHeight: 16,
  },
  searchContainer: {
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
});
