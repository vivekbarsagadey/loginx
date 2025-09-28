import i18n from '@/i18n';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export const WelcomeSlide = ({ width }: { width: number }) => {
    return (
        <ThemedView style={{ width, padding: 24, flex: 1, justifyContent: 'center' }}>
            <ThemedText type="h1">{i18n.t('onb.welcome.title', { app: 'YourApp' })}</ThemedText>
            <ThemedText type="muted" style={{ marginTop: 8 }}>
                {i18n.t('onb.welcome.body')}
            </ThemedText>
        </ThemedView>
    );
};
