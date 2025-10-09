import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'bg');
  const textColor = useThemeColor({}, 'text');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor,
        },
        headerTintColor: textColor,
        // Smooth fade animation for tab switches (150ms duration is optimal)
        animation: 'fade',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('navigation.titles.home'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: i18n.t('navigation.titles.items'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: i18n.t('navigation.titles.settings'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />,
        }}
      />
    </Tabs>
  );
}
