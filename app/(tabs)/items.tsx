import { TabHeader } from '@/components/navigation/TabHeader';
import { ScreenContainer } from '@/components/screen-container';
import { EmptyState } from '@/components/ui/empty-state';
import { EmptyItemsIllustration } from '@/components/ui/illustrations';
import i18n from '@/i18n';
import { useState } from 'react';

type Item = {
  id: string;
  name: string;
};

export default function ItemsScreen() {
  const [items] = useState<Item[]>([]); // Placeholder for items data

  const handleAddItem = () => {
    // Navigate to add item screen or show add item modal
    // Implementation will be added when item creation is implemented
  };

  return (
    <>
      <TabHeader title={i18n.t('screens.items.title')} showBackButton={false} />
      <ScreenContainer scrollable useSafeArea={false}>
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
