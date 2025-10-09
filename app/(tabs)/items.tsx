import { TabHeader } from '@/components/navigation/TabHeader';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { useLanguage } from '@/hooks/use-language-provider';
import i18n from '@/i18n';

export default function ItemsScreen() {
  const { language } = useLanguage(); // Track language changes

  return (
    <>
      <TabHeader title={i18n.t('screens.items.title')} showBackButton={false} />
      <ScreenContainer scrollable useSafeArea={false}>
        <ThemedText type="h1">{i18n.t('screens.items.title')}</ThemedText>
      </ScreenContainer>
    </>
  );
}
