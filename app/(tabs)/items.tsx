import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';

export default function ItemsScreen() {
  return (
    <ScreenContainer scrollable>
      <ThemedText type="h1">Items</ThemedText>
    </ScreenContainer>
  );
}
