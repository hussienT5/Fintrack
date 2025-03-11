import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useFinanceStore } from '../../store/useFinanceStore';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { format, subDays, startOfDay, endOfDay, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { useThemeStore } from '../../store/useThemeStore';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

export default function AnalyticsScreen() {
  const { transactions, getSpendingByCategory } = useFinanceStore();
  const { isDark } = useThemeStore();
  const spendingByCategory = getSpendingByCategory();
  const translateX = useSharedValue(0);
  const activeView = useSharedValue(0);
  const context = useSharedValue({ x: 0 });
  const isGestureActive = useSharedValue(false);
  const screenWidth = Dimensions.get('window').width - 48;

  // Calculate last 7 days spending
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    const dayTotal = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.date >= dayStart &&
        t.date <= dayEnd
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date,
      amount: dayTotal
    };
  }).reverse();

  // Calculate last 12 months spending
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthTotal = transactions
      .filter(t => 
        t.type === 'expense' &&
        t.date >= monthStart &&
        t.date <= monthEnd
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: format(date, 'MMM'),
      amount: monthTotal
    };
  }).reverse();

  const chartConfig = {
    backgroundColor: isDark ? '#1F2937' : '#fff',
    backgroundGradientFrom: isDark ? '#1F2937' : '#fff',
    backgroundGradientTo: isDark ? '#1F2937' : '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => isDark 
      ? `rgba(129, 140, 248, ${opacity})`
      : `rgba(99, 102, 241, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontFamily: 'Inter-Medium',
      fill: isDark ? '#9CA3AF' : '#6B7280',
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: isDark ? '#818CF8' : '#6366F1'
    },
    propsForBackgroundLines: {
      stroke: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(203, 213, 225, 0.3)',
      strokeDasharray: '5, 5'
    }
  };

  const pieChartData = spendingByCategory.map((category, index) => ({
    name: category.category,
    amount: category.amount,
    color: `hsl(${index * 50}, ${isDark ? '60%' : '70%'}, ${isDark ? '60%' : '50%'})`,
    legendFontColor: isDark ? '#9CA3AF' : '#6B7280',
    legendFontFamily: 'Inter-Regular',
  }));

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isGestureActive.value = true;
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      if (!isGestureActive.value) return;
      translateX.value = context.value.x + event.translationX;
    })
    .onEnd((event) => {
      if (!isGestureActive.value) return;
      
      if (Math.abs(event.velocityX) > 500 || Math.abs(event.translationX) > screenWidth / 3) {
        if (event.velocityX > 0 && activeView.value > 0) {
          activeView.value = 0;
          translateX.value = withSpring(0, { damping: 15 });
        } else if (event.velocityX < 0 && activeView.value < 1) {
          activeView.value = 1;
          translateX.value = withSpring(-screenWidth, { damping: 15 });
        } else {
          translateX.value = withSpring(
            activeView.value === 0 ? 0 : -screenWidth,
            { damping: 15 }
          );
        }
      } else {
        translateX.value = withSpring(
          activeView.value === 0 ? 0 : -screenWidth,
          { damping: 15 }
        );
      }
      
      isGestureActive.value = false;
    })
    .onFinalize(() => {
      isGestureActive.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: interpolate(
        translateX.value,
        [0, -screenWidth],
        [0, screenWidth / 2 - 12],
        Extrapolate.CLAMP
      )
    }],
  }));

  const handleViewChange = (index: number) => {
    if (isGestureActive.value) return;
    activeView.value = index;
    translateX.value = withSpring(
      index === 0 ? 0 : -screenWidth,
      { damping: 15 }
    );
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Analytics</Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>Track your spending patterns</Text>
      </View>

      <View style={[styles.section, isDark && styles.sectionDark]}>
        <View style={[styles.viewSelector, isDark && styles.viewSelectorDark]}>
          <Animated.View style={[
            styles.viewIndicator,
            isDark && styles.viewIndicatorDark,
            indicatorStyle
          ]} />
          <Pressable 
            style={styles.viewButton} 
            onPress={() => handleViewChange(0)}
          >
            <Text style={[
              styles.viewButtonText,
              isDark && styles.viewButtonTextDark,
              activeView.value === 0 && styles.viewButtonTextActive,
              activeView.value === 0 && isDark && styles.viewButtonTextActiveDark,
            ]}>Daily</Text>
          </Pressable>
          <Pressable 
            style={styles.viewButton}
            onPress={() => handleViewChange(1)}
          >
            <Text style={[
              styles.viewButtonText,
              isDark && styles.viewButtonTextDark,
              activeView.value === 1 && styles.viewButtonTextActive,
              activeView.value === 1 && isDark && styles.viewButtonTextActiveDark,
            ]}>Monthly</Text>
          </Pressable>
        </View>

        <View style={[styles.chartWrapper, { width: screenWidth }]}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.chartContainer, animatedStyle]}>
              <View style={[styles.chartPage, { width: screenWidth }]}>
                <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Daily Spending</Text>
                <Text style={[styles.sectionSubtitle, isDark && styles.subtitleDark]}>Last 7 days</Text>
                <View style={styles.chartContent}>
                  <LineChart
                    data={{
                      labels: last7Days.map(day => format(day.date, 'EEE')),
                      datasets: [{
                        data: last7Days.map(day => day.amount),
                      }],
                    }}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withVerticalLines={true}
                    withHorizontalLines={true}
                    withDots={true}
                    withInnerLines={true}
                    withOuterLines={true}
                    formatYLabel={(value) => `$${parseInt(value)}`}
                    yAxisLabel=""
                    yAxisSuffix=""
                    fromZero
                  />
                </View>
              </View>

              <View style={[styles.chartPage, { width: screenWidth }]}>
                <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Monthly Spending</Text>
                <Text style={[styles.sectionSubtitle, isDark && styles.subtitleDark]}>Last 12 months</Text>
                <View style={styles.chartContent}>
                  <LineChart
                    data={{
                      labels: last12Months.map(month => month.month),
                      datasets: [{
                        data: last12Months.map(month => month.amount),
                      }],
                    }}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withVerticalLines={true}
                    withHorizontalLines={true}
                    withDots={true}
                    withInnerLines={true}
                    withOuterLines={true}
                    formatYLabel={(value) => `$${parseInt(value)}`}
                    yAxisLabel=""
                    yAxisSuffix=""
                    fromZero
                  />
                </View>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        <View style={styles.navigationHint}>
          <ChevronLeft size={16} color={isDark ? '#6B7280' : '#9CA3AF'} />
          <Text style={[styles.navigationHintText, isDark && styles.navigationHintTextDark]}>
            Swipe to switch views
          </Text>
          <ChevronRight size={16} color={isDark ? '#6B7280' : '#9CA3AF'} />
        </View>
      </View>

      <View style={[styles.section, isDark && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Spending by Category</Text>
        {spendingByCategory.length > 0 ? (
          <>
            <View style={styles.chartContent}>
              <PieChart
                data={pieChartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
            </View>
            <View style={styles.legendContainer}>
              {pieChartData.map((data, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: data.color }]} />
                  <Text style={[styles.legendText, isDark && styles.legendTextDark]}>{data.name}</Text>
                  <Text style={[styles.legendAmount, isDark && styles.legendAmountDark]}>${data.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, isDark && styles.emptyStateTextDark]}>No data available</Text>
            <Text style={[styles.emptyStateSubtext, isDark && styles.emptyStateSubtextDark]}>
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
    backgroundColor: '#F8FAFC',
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
    marginBottom: 4,
  },
  titleDark: {
    color: '#F9FAFB',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  subtitleDark: {
    color: '#9CA3AF',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 24,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sectionDark: {
    backgroundColor: '#1F2937',
    borderColor: 'rgba(55, 65, 81, 0.3)',
    shadowColor: '#000',
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    position: 'relative',
    height: 40,
  },
  viewSelectorDark: {
    backgroundColor: '#374151',
  },
  viewButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  viewIndicator: {
    position: 'absolute',
    width: '48%',
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 8,
    top: 4,
    left: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  viewIndicatorDark: {
    backgroundColor: '#4B5563',
  },
  viewButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  viewButtonTextDark: {
    color: '#9CA3AF',
  },
  viewButtonTextActive: {
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  viewButtonTextActiveDark: {
    color: '#F9FAFB',
  },
  chartWrapper: {
    overflow: 'hidden',
  },
  chartContainer: {
    flexDirection: 'row',
  },
  chartPage: {
    flex: 0,
  },
  chartContent: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: -20,
  },
  navigationHint: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  navigationHintText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  navigationHintTextDark: {
    color: '#6B7280',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#F9FAFB',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
  },
  legendTextDark: {
    color: '#9CA3AF',
  },
  legendAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1F2937',
  },
  legendAmountDark: {
    color: '#F9FAFB',
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
  emptyStateTextDark: {
    color: '#9CA3AF',
  },
  emptyStateSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyStateSubtextDark: {
    color: '#9CA3AF',
  },
});