import i18n from '@/i18n';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { View } from 'react-native';

export const FeaturesSlide = ({ width }: { width: number }) => {
    return (
        <ThemedView style={{ width, padding: 24, flex: 1, justifyContent: 'center' }}>
            <ThemedText type="h1">{i18n.t('onb.features.title')}</ThemedText>
            <View style={{ marginTop: 16 }}>
                <ThemedText type="body" style={{ marginBottom: 8 }}>- {i18n.t('onb.features.f1')}</ThemedText>
                <ThemedText type="body" style={{ marginBottom: 8 }}>- {i18n.t('onb.features.f2')}</ThemedText>
                <ThemedText type="body" style={{ marginBottom: 8 }}>- {i18n.t('onb.features.f3')}</ThemedText>
            </View>
        </ThemedView>
    );
};
