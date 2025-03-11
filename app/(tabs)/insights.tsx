import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useFinanceStore } from '../../store/useFinanceStore';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function InsightsScreen() {
  const { transactions, getSpendingByCategory } = useFinanceStore();
  const spendingByCategory = getSpendingByCategory();

  // Calculate daily spending for the current month
  const currentMonth = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const dailySpending = daysInMonth.map(day => {
    const dayTotal = transactions
      .filter(t => 
        t.type === 'expense' && 
        format(t.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      .reduce((sum, t) => sum + t.amount, 0);
    return dayTotal;
  });

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const pieChartData = spendingByCategory.map((category, index) => ({
    name: category.category,
    amount: category.amount,
    color: `hsl(${index * 50}, 70%, 50%)`,
    legendFontColor: '#6B7280',
    legendFontFamily: 'Inter-Regular',
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Insights</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Spending Trend</Text>
        <LineChart
          data={{
            labels: daysInMonth.map(day => format(day, 'd')),
            datasets: [{
              data: dailySpending,
            }],
          }}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        {spendingByCategory.length > 0 ? (
          <PieChart
            data={pieChartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No data available</Text>
            <Text style={styles.emptyStateSubtext}>
              Add some transactions to see insights
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
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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