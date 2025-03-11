import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useFinanceStore } from '../../store/useFinanceStore';
import { useUserStore } from '../../store/useUserStore';
import { useThemeStore } from '../../store/useThemeStore';
import { ArrowDownRight, ArrowUpRight, Filter, Plus, Chrome as Home } from 'lucide-react-native';
import { format } from 'date-fns';
import TransactionCard from '../../components/TransactionCard';
import GlassmorphicCard from '../../components/GlassmorphicCard';
import AddTransactionModal from '../../components/AddTransactionModal';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { MotiPressable } from 'moti/interactions';

export default function HomeScreen() {
  const router = useRouter();
  const { transactions, getBalance } = useFinanceStore();
  const { name, avatar } = useUserStore();
  const { isDark } = useThemeStore();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const addButtonRef = useRef(null);

  const balance = getBalance();
  const firstName = name.split(' ')[0]; // Extract first name

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3);

  const handleAddPress = () => {
    addButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setButtonPosition({ x: pageX, y: pageY, width, height });
      setIsAddModalVisible(true);
    });
  };

  return (
    <>
      <ScrollView style={[styles.container, isDark && styles.containerDark]}>
        <View style={[styles.backgroundGradient, isDark && styles.backgroundGradientDark]} />
        
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.greeting, isDark && styles.textDark]}>Hello, {firstName}</Text>
              <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>Track your spending, save more</Text>
            </View>
            <MotiPressable
              onPress={() => router.push('/profile')}
              animate={({ pressed }) => ({
                scale: pressed ? 0.95 : 1,
                opacity: pressed ? 0.9 : 1,
              })}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 300,
              }}
              style={styles.profileButton}
            >
              <Image
                source={{ uri: avatar }}
                style={styles.profileImage}
              />
            </MotiPressable>
          </View>
        </View>

        <GlassmorphicCard style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, isDark && styles.labelDark]}>Current Balance</Text>
            <Pressable
              ref={addButtonRef}
              style={[styles.addButton, isDark && styles.addButtonDark]}
              onPress={handleAddPress}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={3} />
            </Pressable>
          </View>
          <Text style={[styles.balanceAmount, isDark && styles.textDark]}>${balance.toFixed(2)}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(22, 163, 74, 0.2)' : 'rgba(22, 163, 74, 0.1)' }]}>
                <ArrowUpRight size={20} color={isDark ? '#34D399' : '#16A34A'} />
              </View>
              <Text style={[styles.statLabel, isDark && styles.labelDark]}>Income</Text>
              <Text style={[styles.statAmount, { color: isDark ? '#34D399' : '#16A34A' }]}>
                ${income.toFixed(2)}
              </Text>
            </View>

            <View style={[styles.divider, isDark && styles.dividerDark]} />

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(220, 38, 38, 0.2)' : 'rgba(220, 38, 38, 0.1)' }]}>
                <ArrowDownRight size={20} color={isDark ? '#F87171' : '#DC2626'} />
              </View>
              <Text style={[styles.statLabel, isDark && styles.labelDark]}>Expenses</Text>
              <Text style={[styles.statAmount, { color: isDark ? '#F87171' : '#DC2626' }]}>
                ${expenses.toFixed(2)}
              </Text>
            </View>
          </View>
        </GlassmorphicCard>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Recent Transactions</Text>
            <View style={styles.transactionActions}>
              <Pressable style={[styles.filterButton, isDark && styles.filterButtonDark]}>
                <Filter size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <Text style={[styles.filterText, isDark && styles.filterTextDark]}>Filter</Text>
              </Pressable>
              <Pressable style={styles.seeAllLink}>
                <Text style={[styles.seeAllText, isDark && styles.seeAllTextDark]}>See All</Text>
              </Pressable>
            </View>
          </View>

          {recentTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </View>
      </ScrollView>

      <AddTransactionModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        buttonPosition={buttonPosition}
      />
    </>
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
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: '#EEF2FF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backgroundGradientDark: {
    backgroundColor: '#1E1B4B',
  },
  header: {
    padding: 24,
    paddingTop: 72,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
  },
  subtitleDark: {
    color: '#9CA3AF',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  balanceCard: {
    margin: 16,
    padding: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
  },
  labelDark: {
    color: '#9CA3AF',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDark: {
    backgroundColor: '#4F46E5',
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#1E293B',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(203, 213, 225, 0.4)',
    marginHorizontal: 16,
  },
  dividerDark: {
    backgroundColor: 'rgba(75, 85, 99, 0.4)',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  statAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  section: {
    margin: 16,
    marginTop: 8,
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  transactionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterButtonDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  filterTextDark: {
    color: '#9CA3AF',
  },
  seeAllLink: {
    padding: 8,
  },
  seeAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4F46E5',
  },
  seeAllTextDark: {
    color: '#818CF8',
  },
  textDark: {
    color: '#F9FAFB',
  },
});