import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import i18n from '@/i18n';
import { ScrollView, StyleSheet } from 'react-native';

export default function LicenseScreen() {
  const libraries = i18n.t('screens.legal.license.openSource.libraries', { returnObjects: true }) as { name: string; license: string; description: string }[];

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <ThemedText type="h1" style={styles.title}>
          {i18n.t('screens.legal.license.title')}
        </ThemedText>

        <ThemedView style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            {i18n.t('screens.legal.license.appLicense.title')}
          </ThemedText>
          <ThemedText style={styles.sectionContent}>{i18n.t('screens.legal.license.appLicense.content')}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            {i18n.t('screens.legal.license.openSource.title')}
          </ThemedText>
          <ThemedText style={styles.sectionContent}>{i18n.t('screens.legal.license.openSource.intro')}</ThemedText>

          {libraries.map((library, index) => (
            <ThemedView key={index} style={styles.libraryItem}>
              <ThemedText type="body" style={styles.libraryName}>
                {library.name}
              </ThemedText>
              <ThemedText style={styles.libraryLicense}>{library.license}</ThemedText>
              <ThemedText style={styles.libraryDescription}>{library.description}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            {i18n.t('screens.legal.license.copyright.title')}
          </ThemedText>
          <ThemedText style={styles.sectionContent}>{i18n.t('screens.legal.license.copyright.content')}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            {i18n.t('screens.legal.license.attribution.title')}
          </ThemedText>
          <ThemedText style={styles.sectionContent}>{i18n.t('screens.legal.license.attribution.content')}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  sectionContent: {
    lineHeight: 22,
    opacity: 0.9,
    marginBottom: 16,
  },
  libraryItem: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    // Background handled by theme
  },
  libraryName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  libraryLicense: {
    opacity: 0.7,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  libraryDescription: {
    opacity: 0.8,
    lineHeight: 18,
  },
});
