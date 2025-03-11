import { Tabs } from 'expo-router';
import { Wallet, Chrome as Home, ChartLine } from 'lucide-react-native';
import { View, StyleSheet, Pressable, Text, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useThemeStore } from '../../store/useThemeStore';
import { useEffect } from 'react';

// Create a custom event emitter for cross-component communication
class EventEmitter {
  private listeners: { [key: string]: Set<Function> } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event].add(callback);
    
    // Return cleanup function
    return () => {
      if (this.listeners[event]) {
        this.listeners[event].delete(callback);
        if (this.listeners[event].size === 0) {
          delete this.listeners[event];
        }
      }
    };
  }

  emit(event: string, data?: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }
}

export const eventEmitter = new EventEmitter();

function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark } = useThemeStore();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const baseIconSize = 22;
  const activeIconSize = 26;

  const handleTabPress = (path: string) => {
    // Emit an event to close any open modals
    eventEmitter.emit('closeModals');
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.tabBar,
        isDark && styles.tabBarDark
      ]}>
        <Pressable
          style={[
            styles.tab,
            isActive('/accounts') && styles.activeTab,
            isDark && styles.tabDark,
            isActive('/accounts') && isDark && styles.activeTabDark
          ]}
          onPress={() => handleTabPress('/accounts')}
        >
          <Wallet 
            size={isActive('/accounts') ? activeIconSize : baseIconSize}
            color={isActive('/accounts') 
              ? (isDark ? '#A78BFA' : '#8B5CF6')
              : (isDark ? '#9CA3AF' : '#1F2937')
            } 
          />
          <Text style={[
            styles.tabText,
            isActive('/accounts') && styles.activeTabText,
            isDark && styles.tabTextDark,
            isActive('/accounts') && isDark && styles.activeTabTextDark
          ]}>Accounts</Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.tab,
            isActive('/') && styles.activeTab,
            isDark && styles.tabDark,
            isActive('/') && isDark && styles.activeTabDark
          ]}
          onPress={() => handleTabPress('/')}
        >
          <Home 
            size={isActive('/') ? activeIconSize : baseIconSize}
            color={isActive('/') 
              ? (isDark ? '#A78BFA' : '#8B5CF6')
              : (isDark ? '#9CA3AF' : '#1F2937')
            } 
          />
          <Text style={[
            styles.tabText,
            isActive('/') && styles.activeTabText,
            isDark && styles.tabTextDark,
            isActive('/') && isDark && styles.activeTabTextDark
          ]}>Home</Text>
        </Pressable>

        <Pressable
          style={[
            styles.tab,
            isActive('/analytics') && styles.activeTab,
            isDark && styles.tabDark,
            isActive('/analytics') && isDark && styles.activeTabDark
          ]}
          onPress={() => handleTabPress('/analytics')}
        >
          <ChartLine 
            size={isActive('/analytics') ? activeIconSize : baseIconSize}
            color={isActive('/analytics') 
              ? (isDark ? '#A78BFA' : '#8B5CF6')
              : (isDark ? '#9CA3AF' : '#1F2937')
            } 
          />
          <Text style={[
            styles.tabText,
            isActive('/analytics') && styles.activeTabText,
            isDark && styles.tabTextDark,
            isActive('/analytics') && isDark && styles.activeTabTextDark
          ]}>Analytics</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="accounts" />
        <Tabs.Screen name="analytics" />
      </Tabs>
      <TabBar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.98)',
      android: '#FFFFFF',
      default: 'rgba(255, 255, 255, 0.98)'
    }),
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 32,
    gap: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      }
    }),
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabBarDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(31, 41, 55, 0.98)',
      android: '#1F2937',
      default: 'rgba(31, 41, 55, 0.98)'
    }),
    borderColor: 'rgba(55, 65, 81, 0.3)',
  },
  tab: {
    alignItems: 'center',
  },
  tabDark: {
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  activeTabDark: {
    backgroundColor: 'transparent',
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  tabTextDark: {
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#8B5CF6',
    fontFamily: 'Inter-SemiBold',
  },
  activeTabTextDark: {
    color: '#A78BFA',
    fontFamily: 'Inter-SemiBold',
  }
});