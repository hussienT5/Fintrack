import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CreditCard, TrendingUp, Wallet } from 'lucide-react-native';
import GlassmorphicCard from './GlassmorphicCard';
import { useThemeStore } from '../store/useThemeStore';

type AccountType = 'bank' | 'investment' | 'crypto';

interface AccountCardProps {
  type: AccountType;
  name: string;
  balance: number;
  institution: string;
  lastFour?: string;
  growth?: number;
  onPress?: () => void;
}

export default function AccountCard({
  type,
  name,
  balance,
  institution,
  lastFour,
  growth,
  onPress,
}: AccountCardProps) {
  const { isDark } = useThemeStore();

  const getIcon = () => {
    switch (type) {
      case 'bank':
        return <CreditCard size={24} color={isDark ? '#818CF8' : '#6366F1'} />;
      case 'investment':
        return <TrendingUp size={24} color={isDark ? '#34D399' : '#16A34A'} />;
      case 'crypto':
        return <Wallet size={24} color={isDark ? '#A78BFA' : '#9333EA'} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'bank':
        return isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)';
      case 'investment':
        return isDark ? 'rgba(22, 163, 74, 0.2)' : 'rgba(22, 163, 74, 0.1)';
      case 'crypto':
        return isDark ? 'rgba(147, 51, 234, 0.2)' : 'rgba(147, 51, 234, 0.1)';
    }
  };

  return (
    <Pressable onPress={onPress}>
      <GlassmorphicCard style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: getBackgroundColor() }]}>
          {getIcon()}
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.name, isDark && styles.textDark]}>{name}</Text>
            <Text style={[styles.balance, isDark && styles.textDark]}>
              ${balance.toLocaleString()}
            </Text>
          </View>
          <View style={styles.footer}>
            <Text style={[styles.institution, isDark && styles.textMutedDark]}>
              {institution}
              {lastFour && ` •••• ${lastFour}`}
            </Text>
            {growth !== undefined && (
              <Text style={[
                styles.growth,
                { color: growth >= 0 
                  ? (isDark ? '#34D399' : '#16A34A') 
                  : (isDark ? '#F87171' : '#DC2626') 
                }
              ]}>
                {growth >= 0 ? '+' : ''}{growth}%
              </Text>
            )}
          </View>
        </View>
      </GlassmorphicCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  balance: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  institution: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  growth: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  textDark: {
    color: '#F9FAFB',
  },
  textMutedDark: {
    color: '#9CA3AF',
  },
});