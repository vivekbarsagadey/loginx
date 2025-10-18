import { TabHeader } from '@/components/navigation/TabHeader';
import { ScreenContainer } from '@/components/screen-container';
import { EmptyState } from '@/components/ui/empty-state';
import { EmptyItemsIllustration } from '@/components/ui/illustrations';
import { useThemeColors } from '@/hooks/use-theme-colors';
import i18n from '@/i18n';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';

type Item = {
  id: string;
  name: string;
};

export default function ItemsScreen() {
  const colors = useThemeColors();
  const [items] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch items function - currently empty, will be implemented when items feature is added
  const fetchItems = useCallback(async () => {
    // TODO: Implement actual items fetching logic
    // Example: const fetchedItems = await getItems();
    // setItems(fetchedItems);
    setRefreshing(false);
  }, []);

  const onRefresh = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRefreshing(true);
    await fetchItems();
  }, [fetchItems]); // Placeholder for items data

  const handleAddItem = () => {
    // Navigate to add item screen or show add item modal
    // Implementation will be added when item creation is implemented
  };

  return (
    <>
      <TabHeader title={i18n.t('screens.items.title')} showBackButton={false} />
      <ScreenContainer
        scrollable
        useSafeArea={false}
        scrollViewProps={{
          refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />,
        }}
      >
        {items.length === 0 ? (
          <EmptyState
            illustration={<EmptyItemsIllustration />}
            title={i18n.t('emptyStates.items.title')}
            description={i18n.t('emptyStates.items.description')}
            actionLabel={i18n.t('emptyStates.items.action')}
            onActionPress={handleAddItem}
          />
        ) : // Render items list here when items exist
        null}
      </ScreenContainer>
    </>
  );
}
