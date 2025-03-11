import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { Bell, ChevronRight, CreditCard, CircleHelp as HelpCircle, Lock, User, Moon } from 'lucide-react-native';
import { useState } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { useColorScheme } from 'react-native';

type SettingItemProps = {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  showChevron?: boolean;
  value?: React.ReactNode;
};

function SettingItem({ icon, title, onPress, showChevron = true, value }: SettingItemProps) {
  const { isDark } = useThemeStore();
  
  return (
    <Pressable 
      style={[
        styles.settingItem,
        isDark && styles.settingItemDark
      ]} 
      onPress={onPress}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={[
        styles.settingTitle,
        isDark && styles.settingTitleDark
      ]}>{title}</Text>
      <View style={styles.settingValue}>
        {value}
        {showChevron && <ChevronRight size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { theme, setTheme, isDark } = useThemeStore();
  const systemColorScheme = useColorScheme();

  const handleThemeChange = () => {
    const nextTheme = theme === 'system' 
      ? (systemColorScheme === 'dark' ? 'light' : 'dark')
      : theme === 'dark' 
        ? 'light' 
        : 'dark';
    setTheme(nextTheme, systemColorScheme === 'dark');
  };

  return (
    <View style={[
      styles.container,
      isDark && styles.containerDark
    ]}>
      <View style={[
        styles.header,
        isDark && styles.headerDark
      ]}>
        <Text style={[
          styles.title,
          isDark && styles.titleDark
        ]}>Settings</Text>
      </View>

      <View style={[
        styles.section,
        isDark && styles.sectionDark
      ]}>
        <Text style={[
          styles.sectionTitle,
          isDark && styles.sectionTitleDark
        ]}>Account</Text>
        <SettingItem
          icon={<User size={24} color={isDark ? '#818CF8' : '#6366F1'} />}
          title="Profile"
          onPress={() => {}}
        />
        <SettingItem
          icon={<Lock size={24} color={isDark ? '#818CF8' : '#6366F1'} />}
          title="Security"
          onPress={() => {}}
        />
        <SettingItem
          icon={<CreditCard size={24} color={isDark ? '#818CF8' : '#6366F1'} />}
          title="Payment Methods"
          onPress={() => {}}
        />
      </View>

      <View style={[
        styles.section,
        isDark && styles.sectionDark
      ]}>
        <Text style={[
          styles.sectionTitle,
          isDark && styles.sectionTitleDark
        ]}>Preferences</Text>
        <SettingItem
          icon={<Bell size={24} color={isDark ? '#818CF8' : '#6366F1'} />}
          title="Notifications"
          onPress={() => {}}
          showChevron={false}
          value={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: isDark ? '#374151' : '#D1D5DB', true: isDark ? '#4F46E5' : '#818CF8' }}
              thumbColor={notificationsEnabled ? (isDark ? '#818CF8' : '#6366F1') : isDark ? '#6B7280' : '#fff'}
            />
          }
        />
        <SettingItem
          icon={<Moon size={24} color={isDark ? '#818CF8' : '#6366F1'} />}
          title="Dark Mode"
          onPress={() => {}}
          showChevron={false}
          value={
            <Switch
              value={isDark}
              onValueChange={handleThemeChange}
              trackColor={{ false: isDark ? '#374151' : '#D1D5DB', true: isDark ? '#4F46E5' : '#818CF8' }}
              thumbColor={isDark ? '#818CF8' : '#6366F1'}
            />
          }
        />
      </View>

      <View style={[
        styles.section,
        isDark && styles.sectionDark
      ]}>
        <Text style={[
          styles.sectionTitle,
          isDark && styles.sectionTitleDark
        ]}>Support</Text>
        <SettingItem
          icon={<HelpCircle size={24} color={isDark ? '#818CF8' : '#6366F1'} />}
          title="Help & Support"
          onPress={() => {}}
        />
      </View>

      <Pressable style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  containerDark: {
    backgroundColor: '#1A1B1E',
  },
  header: {
    padding: 24,
    paddingTop: 72,
    backgroundColor: '#fff',
  },
  headerDark: {
    backgroundColor: '#1F2937',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  titleDark: {
    color: '#F9FAFB',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionDark: {
    backgroundColor: '#1F2937',
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitleDark: {
    color: '#9CA3AF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  settingItemDark: {
    borderTopColor: '#374151',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  settingTitleDark: {
    color: '#F9FAFB',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});