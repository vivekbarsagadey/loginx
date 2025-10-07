import { TabHeader } from '@/components/navigation/TabHeader';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';

export default function ItemsScreen() {
  return (
    <>
      <TabHeader title="Items" showBackButton={false} />
      <ScreenContainer scrollable useSafeArea={false}>
        <ThemedText type="h1">Items</ThemedText>
      </ScreenContainer>
    </>
  );
}
