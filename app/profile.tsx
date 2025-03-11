import { View, Text, StyleSheet, ScrollView, Pressable, Image, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  CreditCard,
  Bell,
  CircleHelp as HelpCircle,
  Camera,
  ChevronRight,
  Shield,
  Wallet,
  LogOut,
  Moon
} from 'lucide-react-native';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { MotiView } from 'moti';
import { useState } from 'react';
import EditProfileModal from '../components/EditProfileModal';
import { useUserStore } from '../store/useUserStore';
import { useThemeStore } from '../store/useThemeStore';

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const { name, avatar, updateProfile } = useUserStore();
  const { theme, setTheme, isDark } = useThemeStore();
  const systemColorScheme = useColorScheme();

  const stats = [
    { label: 'Total Balance', value: '$61,429.13' },
    { label: 'Monthly Savings', value: '$2,845.50' },
    { label: 'Active Goals', value: '3' },
  ];

  const handleProfileUpdate = (newName: string, newImage: string) => {
    updateProfile(newName, newImage);
  };

  const handleThemeChange = () => {
    const nextTheme = theme === 'system' 
      ? (systemColorScheme === 'dark' ? 'light' : 'dark')
      : theme === 'dark' 
        ? 'light' 
        : 'dark';
    setTheme(nextTheme, systemColorScheme === 'dark');
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()} 
          style={[styles.backButton, isDark && styles.backButtonDark]}
        >
          <ArrowLeft size={24} color={isDark ? "#F9FAFB" : "#1F2937"} />
        </Pressable>
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
      >
        <View style={styles.profileSection}>
          <Pressable 
            style={styles.imageContainer}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Image
              source={{ uri: avatar }}
              style={styles.profileImage}
            />
            <View style={styles.cameraButton}>
              <Camera size={20} color="#fff" />
            </View>
          </Pressable>
          <Pressable 
            style={styles.nameContainer}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Text style={[styles.name, isDark && styles.textDark]}>{name}</Text>
            <Text style={[styles.email, isDark && styles.emailDark]}>john@example.com</Text>
          </Pressable>
        </View>
      </MotiView>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <MotiView
            key={stat.label}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: 'spring',
              delay: index * 100,
              damping: 15,
              stiffness: 200
            }}
          >
            <GlassmorphicCard style={styles.statCard}>
              <Text style={[styles.statValue, isDark && styles.textDark]}>{stat.value}</Text>
              <Text style={[styles.statLabel, isDark && styles.labelDark]}>{stat.label}</Text>
            </GlassmorphicCard>
          </MotiView>
        ))}
      </View>

      <View style={styles.sections}>
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
        >
          <GlassmorphicCard style={[styles.section, isDark && styles.sectionDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Account</Text>
            <Pressable style={[styles.menuItem, isDark && styles.menuItemDark]}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)' }]}>
                <Wallet size={24} color={isDark ? "#818CF8" : "#6366F1"} />
              </View>
              <Text style={[styles.menuItemText, isDark && styles.textDark]}>Connected Accounts</Text>
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </Pressable>
            <Pressable style={[styles.menuItem, isDark && styles.menuItemDark]}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)' }]}>
                <CreditCard size={24} color={isDark ? "#34D399" : "#10B981"} />
              </View>
              <Text style={[styles.menuItemText, isDark && styles.textDark]}>Payment Methods</Text>
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </Pressable>
            <Pressable style={[styles.menuItem, isDark && styles.menuItemDark]}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)' }]}>
                <Shield size={24} color={isDark ? "#A78BFA" : "#8B5CF6"} />
              </View>
              <Text style={[styles.menuItemText, isDark && styles.textDark]}>Security</Text>
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </Pressable>
          </GlassmorphicCard>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateX: 20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 300 }}
        >
          <GlassmorphicCard style={[styles.section, isDark && styles.sectionDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Preferences</Text>
            <Pressable style={[styles.menuItem, isDark && styles.menuItemDark]}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.1)' }]}>
                <Bell size={24} color={isDark ? "#F472B6" : "#EC4899"} />
              </View>
              <Text style={[styles.menuItemText, isDark && styles.textDark]}>Notifications</Text>
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </Pressable>
            <Pressable 
              style={[styles.menuItem, isDark && styles.menuItemDark]}
              onPress={handleThemeChange}
            >
              <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)' }]}>
                <Moon size={24} color={isDark ? "#FCD34D" : "#F59E0B"} />
              </View>
              <Text style={[styles.menuItemText, isDark && styles.textDark]}>Dark Mode</Text>
              <View style={styles.themeIndicator}>
                <Text style={[styles.themeText, isDark && styles.themeTextDark]}>
                  {theme === 'system' ? 'System' : theme === 'dark' ? 'On' : 'Off'}
                </Text>
              </View>
            </Pressable>
            <Pressable style={[styles.menuItem, isDark && styles.menuItemDark]}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)' }]}>
                <HelpCircle size={24} color={isDark ? "#FCD34D" : "#F59E0B"} />
              </View>
              <Text style={[styles.menuItemText, isDark && styles.textDark]}>Help & Support</Text>
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </Pressable>
          </GlassmorphicCard>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
        >
          <Pressable style={styles.logoutButton}>
            <LogOut size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </Pressable>
        </MotiView>
      </View>

      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        initialName={name}
        initialImage={avatar}
        onSave={handleProfileUpdate}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#1A1B1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 72,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  backButtonDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    borderColor: 'rgba(55, 65, 81, 0.5)',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  nameContainer: {
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  emailDark: {
    color: '#9CA3AF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  sections: {
    padding: 24,
    paddingTop: 0,
  },
  section: {
    marginBottom: 16,
  },
  sectionDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#9CA3AF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  menuItemDark: {
    borderColor: 'rgba(55, 65, 81, 0.5)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
  },
  themeIndicator: {
    backgroundColor: 'rgba(243, 244, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  themeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  themeTextDark: {
    color: '#9CA3AF',
  },
  textDark: {
    color: '#F9FAFB',
  },
  labelDark: {
    color: '#9CA3AF',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});