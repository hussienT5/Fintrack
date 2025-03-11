import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import AccountCard from '../../components/AccountCard';
import { useRouter } from 'expo-router';
import { useThemeStore } from '../../store/useThemeStore';
import { useState, useRef, useEffect } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import AddAccountModal from '../../components/AddAccountModal';
import { eventEmitter } from './_layout';

export default function AccountsScreen() {
  const router = useRouter();
  const { isDark } = useThemeStore();
  const { accounts, addAccount } = useFinanceStore();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const addButtonRef = useRef(null);

  const bankAccounts = accounts.filter(account => account.type === 'bank');
  const investments = accounts.filter(account => account.type === 'investment');
  const crypto = accounts.filter(account => account.type === 'crypto');

  useEffect(() => {
    const cleanup = eventEmitter.on('closeModals', () => {
      setIsAddModalVisible(false);
    });

    return cleanup;
  }, []);

  const handleAddPress = () => {
    setIsAddModalVisible(true);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, isDark && styles.titleDark]}>Accounts</Text>
            <Pressable
              ref={addButtonRef}
              style={[styles.addButton, isDark && styles.addButtonDark]}
              onPress={handleAddPress}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={3} />
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.titleDark]}>Bank Accounts</Text>
          </View>
          <View style={styles.section}>
            {bankAccounts.map((account) => (
              <AccountCard
                key={account.id}
                {...account}
                onPress={() => router.push(`/accounts/${account.type}/${account.id}`)}
              />
            ))}
            {bankAccounts.length === 0 && (
              <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                No bank accounts added yet
              </Text>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.titleDark]}>Investments</Text>
          </View>
          <View style={styles.section}>
            {investments.map((account) => (
              <AccountCard
                key={account.id}
                {...account}
                onPress={() => router.push(`/accounts/${account.type}/${account.id}`)}
              />
            ))}
            {investments.length === 0 && (
              <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                No investment accounts added yet
              </Text>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.titleDark]}>Crypto</Text>
          </View>
          <View style={styles.section}>
            {crypto.map((account) => (
              <AccountCard
                key={account.id}
                {...account}
                onPress={() => router.push(`/accounts/${account.type}/${account.id}`)}
              />
            ))}
            {crypto.length === 0 && (
              <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                No crypto accounts added yet
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <AddAccountModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={addAccount}
      />
    </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 72,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  titleDark: {
    color: '#F9FAFB',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
  },
  section: {
    marginBottom: 24,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
  emptyTextDark: {
    color: '#9CA3AF',
  },
});