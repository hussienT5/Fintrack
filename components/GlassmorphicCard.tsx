import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function GlassmorphicCard({ children, style }: GlassmorphicCardProps) {
  const { isDark } = useThemeStore();

  return (
    <View style={[
      styles.container,
      isDark && styles.containerDark,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.7)',
      android: '#FFFFFF',
      default: 'rgba(255, 255, 255, 0.7)'
    }),
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      }
    }),
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  containerDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(31, 41, 55, 0.8)',
      android: '#1F2937',
      default: 'rgba(31, 41, 55, 0.8)'
    }),
    borderColor: 'rgba(55, 65, 81, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
      },
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#000',
      }
    }),
  },
});