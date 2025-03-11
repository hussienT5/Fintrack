import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Budget } from '../store/useFinanceStore';
import { CircleDollarSign } from 'lucide-react-native';
import { useThemeStore } from '../store/useThemeStore';

type Props = {
  budget: Budget;
  onPress?: () => void;
};

export default function BudgetCard({ budget, onPress }: Props) {
  const progress = (budget.spent / budget.amount) * 100;
  const isOverBudget = progress > 100;
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
        { backgroundColor: isDark ? '#312E81' : '#E0E7FF' }
      ]}>
        <CircleDollarSign size={24} color={isDark ? '#818CF8' : '#6366F1'} />
      </View>
      <View style={styles.details}>
        <Text style={[
          styles.category,
          isDark && styles.textDark
        ]}>{budget.category}</Text>
        <View style={[
          styles.progressContainer,
          isDark && styles.progressContainerDark
        ]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: isOverBudget ? '#EF4444' : '#6366F1',
              },
            ]}
          />
        </View>
        <View style={styles.amounts}>
          <Text style={[
            styles.spent,
            isDark && styles.textMutedDark
          ]}>
            ${budget.spent.toFixed(2)} <Text style={styles.of}>of</Text> ${budget.amount.toFixed(2)}
          </Text>
          <Text
            style={[
              styles.remaining,
              { color: isOverBudget ? '#EF4444' : '#6366F1' },
            ]}
          >
            {isOverBudget
              ? `$${(budget.spent - budget.amount).toFixed(2)} over`
              : `$${(budget.amount - budget.spent).toFixed(2)} left`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  containerDark: {
    backgroundColor: '#1F2937',
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
  category: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressContainerDark: {
    backgroundColor: '#374151',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  amounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spent: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  of: {
    color: '#9CA3AF',
  },
  remaining: {
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