
import { StyleSheet, useColorScheme, View, TouchableOpacity, Modal, TextInput, Button, Alert, Switch } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import { getAuth, updatePassword } from 'firebase/auth';
import { auth } from '@/firebase-config';
import { getSettings, saveSettings } from '@/actions/setting.action';
import { Theme } from '@/types/setting';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(colorScheme as Theme);
  const [notifications, setNotifications] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    console.log('settings_view');
    getSettings().then(settings => {
        if (settings) {
            if (settings.theme) {
                setTheme(settings.theme);
            }
            setNotifications(settings.notifications === 1);
        }
    });
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    saveSettings(newTheme, notifications);
    console.log(`theme_changed: ${newTheme}`);
  };

  const handleNotificationsChange = (value: boolean) => {
    setNotifications(value);
    saveSettings(theme, value);
  };

  const handleSignOut = () => {
    console.log('sign_out_confirm');
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => auth.signOut() }
      ]
    );
  };
  
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords don't match");
      return;
    }
    try {
        const user = auth.currentUser;
        if (user) {
            await updatePassword(user, newPassword);
            Alert.alert('Success', 'Password updated successfully.');
            setModalVisible(false);
            setNewPassword('');
            setConfirmPassword('');
        } else {
            Alert.alert('Error', 'No user is signed in.');
        }
    } catch (error: any) {
        Alert.alert('Error', error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">Settings</ThemedText>
      
      <ThemedText type="h2">Appearance</ThemedText>
      <View style={styles.settingRow}>
        <ThemedText>Theme</ThemedText>
        <View style={styles.themeOptions}>
          <TouchableOpacity onPress={() => handleThemeChange('light')} style={[styles.themeChip, theme === 'light' && styles.activeTheme]}>
            <ThemedText>Light</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleThemeChange('dark')} style={[styles.themeChip, theme === 'dark' && styles.activeTheme]}>
            <ThemedText>Dark</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleThemeChange('system')} style={[styles.themeChip, theme === 'system' && styles.activeTheme]}>
            <ThemedText>System</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ThemedText type="h2">Notifications</ThemedText>
      <View style={styles.settingRow}>
        <ThemedText>Enable Notifications</ThemedText>
        <Switch
            onValueChange={handleNotificationsChange}
            value={notifications}
        />
      </View>

      <ThemedText type="h2">Account</ThemedText>
      <TouchableOpacity style={styles.settingRow} onPress={() => setModalVisible(true)}>
        <ThemedText>Change Password</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingRow} onPress={handleSignOut}>
        <ThemedText>Sign Out</ThemedText>
      </TouchableOpacity>
      
      <ThemedText type="h2">Legal</ThemedText>
      <TouchableOpacity style={styles.settingRow} onPress={() => Alert.alert("Terms of Service", "This would open in-app webview.")}>
        <ThemedText>Terms</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingRow} onPress={() => Alert.alert("Privacy Policy", "This would open in-app webview.")}>
        <ThemedText>Privacy</ThemedText>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ThemedText type="h2">Change Password</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            onChangeText={setConfirmPassword}
          />
          <Button title="Change Password" onPress={handleChangePassword} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  themeOptions: {
    flexDirection: 'row',
  },
  themeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  activeTheme: {
    backgroundColor: Colors.light.tint,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    padding: 10,
  },
});
