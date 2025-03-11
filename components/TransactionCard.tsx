import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native';
import { format } from 'date-fns';
import type { Transaction } from '../store/useFinanceStore';
import { useThemeStore } from '../store/useThemeStore';

type Props = {
  transaction: Transaction;
  onPress?: () => void;
};

export default function TransactionCard({ transaction, onPress }: Props) {
  const isIncome = transaction.type === 'income';
  const { isDark } = useThemeStore();

  return (
    <Pressable
      style={[
        styles.container,
        isDark && styles.containerDark
      ]}
      onPress={onPress}
    >
      <View style={[
        styles.iconContainer,
        { backgroundColor: isIncome 
          ? (isDark ? 'rgba(22, 163, 74, 0.2)' : 'rgba(22, 163, 74, 0.1)')
          : (isDark ? 'rgba(220, 38, 38, 0.2)' : 'rgba(220, 38, 38, 0.1)')
        }
      ]}>
        {isIncome ? (
          <ArrowUpRight size={24} color="#16A34A" />
        ) : (
          <ArrowDownRight size={24} color="#DC2626" />
        )}
      </View>
      <View style={styles.details}>
        <Text style={[
          styles.description,
          isDark && styles.textDark
        ]}>{transaction.description}</Text>
        <Text style={[
          styles.category,
          isDark && styles.textMutedDark
        ]}>{transaction.category}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.amount, { color: isIncome ? '#16A34A' : '#DC2626' }]}>
          {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
        </Text>
        <Text style={[
          styles.date,
          isDark && styles.textMutedDark
        ]}>{format(transaction.date, 'MMM d, yyyy')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.7)',
      android: '#FFFFFF',
      default: 'rgba(255, 255, 255, 0.7)'
    }),
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    }),
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  containerDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(31, 41, 55, 0.7)',
      android: '#1F2937',
      default: 'rgba(31, 41, 55, 0.7)'
    }),
    borderColor: 'rgba(55, 65, 81, 0.5)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  description: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  category: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  textDark: {
    color: '#F9FAFB',
  },
  textMutedDark: {
    color: '#9CA3AF',
  },
});