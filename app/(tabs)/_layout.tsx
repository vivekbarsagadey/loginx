import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import i18n from '@/i18n';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].icon,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light']['bg-elevated'],
          borderTopColor: Colors[colorScheme ?? 'light'].border,
          borderTopWidth: 1,
        },
        headerShown: false, // Hide header for tab screens - only show tab bar
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
