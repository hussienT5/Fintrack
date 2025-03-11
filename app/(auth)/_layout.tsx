import { Stack } from 'expo-router';
import { useThemeStore } from '../../store/useThemeStore';
import { View, StyleSheet } from 'react-native';

export default function AuthLayout() {
  const { isDark } = useThemeStore();

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
});