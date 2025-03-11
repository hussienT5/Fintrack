import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useFinanceStore } from '../../store/useFinanceStore';
import BudgetCard from '../../components/BudgetCard';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function BudgetsScreen() {
  const { budgets } = useFinanceStore();
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budgets</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/budgets/new')}
        >
          <Plus size={24} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.content}>
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onPress={() => router.push(`/budgets/${budget.id}`)}
          />
        ))}

        {budgets.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No budgets set</Text>
            <Text style={styles.emptyStateSubtext}>
              Start by adding a budget for your expenses
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 24,
    paddingTop: 72,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});