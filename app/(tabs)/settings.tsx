
import { StyleSheet, Switch, TouchableOpacity, View, Image } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { settingsSections } from '@/config/settings';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '@/actions/setting.action';
import { Theme } from '@/types/setting';
import { auth } from '@/firebase-config';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(colorScheme as Theme);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [marketingTips, setMarketingTips] = useState(false);

  useEffect(() => {
    getSettings().then(settings => {
      if (settings) {
        setTheme(settings.theme);
        setPushEnabled(settings.pushEnabled === 1);
        setEmailUpdates(settings.emailUpdates === 1);
        setMarketingTips(settings.marketingTips === 1);
      }
    });
  }, []);

  const handleSave = (newValues: any) => {
    const newSettings = {
        theme,
        pushEnabled,
        emailUpdates,
        marketingTips,
        ...newValues
    };
    saveSettings(newSettings);
  }

  const user = auth.currentUser;

  return (
    <ThemedView style={styles.container}>
        <View style={styles.header}>
            <Image source={{ uri: user?.photoURL ?? '' }} style={styles.avatar} />
            <View>
                <ThemedText type="h2">{user?.displayName}</ThemedText>
                <ThemedText style={{ color: Colors[colorScheme ?? 'light'].gray }}>{user?.email}</ThemedText>
                <TouchableOpacity>
                    <ThemedText style={{ color: Colors[colorScheme ?? 'light'].tint }}>Edit profile ›</ThemedText>
                </TouchableOpacity>
            </View>
        </View>

      {settingsSections.map((section) => (
        <View key={section.title} style={styles.section}>
          {section.title && <ThemedText type="h2">{section.title}</ThemedText>}
          <View style={styles.sectionItems}>
            {section.items.map((item) => (
                <TouchableOpacity key={item.title} style={styles.settingRow}>
                <Feather name={item.icon as any} size={20} color={Colors[colorScheme ?? 'light'].text} />
                <View style={styles.settingInfo}>
                    <ThemedText>{item.title}</ThemedText>
                    {item.subtitle && <ThemedText type="caption" style={{ color: Colors[colorScheme ?? 'light'].gray }}>{item.subtitle}</ThemedText>}
                </View>
                {item.type === 'toggle' && (
                    <Switch
                    value={item.key === 'pushEnabled' ? pushEnabled : item.key === 'emailUpdates' ? emailUpdates : marketingTips}
                    onValueChange={(value) => {
                        if (item.key === 'pushEnabled') setPushEnabled(value);
                        if (item.key === 'emailUpdates') setEmailUpdates(value);
                        if (item.key === 'marketingTips') setMarketingTips(value);
                        handleSave({ [item.key]: value });
                    }}
                    />
                )}
                {item.type === 'label' && (
                    <ThemedText type="caption" style={{ color: Colors[colorScheme ?? 'light'].gray }}>{item.value}</ThemedText>
                )}
                {(item.type === 'link' || item.type === 'danger') && (
                    <Feather name="chevron-right" size={24} color={Colors[colorScheme ?? 'light'].gray} />
                )}
                </TouchableOpacity>
            ))}
            </View>
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionItems: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.gray,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray,
  },
  settingInfo: {
    flex: 1,
    marginLeft: 16,
  },
});
