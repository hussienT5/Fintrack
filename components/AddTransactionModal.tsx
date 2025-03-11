import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { 
  X, 
  UtensilsCrossed, 
  ShoppingBag, 
  Car, 
  Receipt, 
  Gamepad2, 
  Heart, 
  GraduationCap,
  Package,
  Briefcase,
  PiggyBank,
  TrendingUp,
  Gift,
  Building2,
  Coins
} from 'lucide-react-native';
import { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { MotiView } from 'moti';
import { useThemeStore } from '../store/useThemeStore';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
} from 'react-native-reanimated';

const expenseCategories = [
  { id: 'food', name: 'Food & Drinks', color: '#F59E0B', icon: UtensilsCrossed },
  { id: 'shopping', name: 'Shopping', color: '#EC4899', icon: ShoppingBag },
  { id: 'bills', name: 'Bills', color: '#EF4444', icon: Receipt },
  { id: 'transport', name: 'Transportation', color: '#3B82F6', icon: Car },
  { id: 'entertainment', name: 'Entertainment', color: '#8B5CF6', icon: Gamepad2 },
  { id: 'health', name: 'Health', color: '#10B981', icon: Heart },
  { id: 'education', name: 'Education', color: '#6366F1', icon: GraduationCap },
  { id: 'other', name: 'Other', color: '#6B7280', icon: Package },
];

const incomeCategories = [
  { id: 'salary', name: 'Salary', color: '#059669', icon: Briefcase },
  { id: 'savings', name: 'Savings', color: '#8B5CF6', icon: PiggyBank },
  { id: 'investments', name: 'Investments', color: '#10B981', icon: TrendingUp },
  { id: 'gifts', name: 'Gifts', color: '#EC4899', icon: Gift },
  { id: 'rental', name: 'Rental', color: '#6366F1', icon: Building2 },
  { id: 'other', name: 'Other Income', color: '#F59E0B', icon: Coins },
];

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  buttonPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export default function AddTransactionModal({ visible, onClose, buttonPosition }: AddTransactionModalProps) {
  const { addTransaction } = useFinanceStore();
  const { isDark } = useThemeStore();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(expenseCategories[0].id);
  const [error, setError] = useState<string | null>(null);
  const activeView = useSharedValue(0);

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleTypeChange = (newType: 'expense' | 'income') => {
    const index = newType === 'expense' ? 0 : 1;
    activeView.value = index;
    setType(newType);
    setSelectedCategory(newType === 'expense' ? expenseCategories[0].id : incomeCategories[0].id);
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: withSpring(activeView.value * 50 + '%', {
        damping: 15,
        stiffness: 300,
      })
    }],
  }));

  const handleSubmit = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError('Please enter a valid amount');
      return;
    }
    if (!description) {
      setError('Please enter a description');
      return;
    }

    const category = categories.find(c => c.id === selectedCategory)?.name || 'Other';
    
    addTransaction({
      amount: parseFloat(amount),
      description,
      category,
      type,
      date: new Date(),
    });

    setAmount('');
    setDescription('');
    setSelectedCategory(categories[0].id);
    setError(null);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint={isDark ? "dark" : "light"} />
      
      <MotiView
        style={[StyleSheet.absoluteFill]}
        from={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          type: 'timing',
          duration: 300,
        }}
      >
        <View style={styles.modalContainer}>
          <MotiView
            from={{
              opacity: 0,
              scale: 0.8,
              translateY: buttonPosition.y - 300,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              translateY: 0,
            }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
            }}
            style={[styles.modalContent, isDark && styles.modalContentDark]}
          >
            <View style={styles.header}>
              <Text style={[styles.title, isDark && styles.titleDark]}>Add Transaction</Text>
              <Pressable 
                onPress={onClose} 
                style={[styles.closeButton, isDark && styles.closeButtonDark]}
              >
                <X size={24} color={isDark ? "#F9FAFB" : "#1F2937"} />
              </Pressable>
            </View>

            <View style={[styles.typeSelector, isDark && styles.typeSelectorDark]}>
              <Animated.View style={[
                styles.typeSelectorBackground,
                isDark && styles.typeSelectorBackgroundDark,
                indicatorStyle
              ]} />
              <Pressable
                style={styles.typeButton}
                onPress={() => handleTypeChange('expense')}
              >
                <Text style={[
                  styles.typeButtonText,
                  isDark && styles.typeButtonTextDark,
                  type === 'expense' && styles.typeButtonTextActive,
                  type === 'expense' && isDark && styles.typeButtonTextActiveDark
                ]}>
                  Expense
                </Text>
              </Pressable>
              <Pressable
                style={styles.typeButton}
                onPress={() => handleTypeChange('income')}
              >
                <Text style={[
                  styles.typeButtonText,
                  isDark && styles.typeButtonTextDark,
                  type === 'income' && styles.typeButtonTextActive,
                  type === 'income' && isDark && styles.typeButtonTextActiveDark
                ]}>
                  Income
                </Text>
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, isDark && styles.labelDark]}>Amount</Text>
              <TextInput
                style={[styles.amountInput, isDark && styles.inputDark]}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={amount}
                onChangeText={(text) => {
                  setError(null);
                  setAmount(text);
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, isDark && styles.labelDark]}>Description</Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Enter description"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={description}
                onChangeText={(text) => {
                  setError(null);
                  setDescription(text);
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, isDark && styles.labelDark]}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  return (
                    <Pressable
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        isDark && styles.categoryButtonDark,
                        isSelected && styles.categoryButtonActive,
                        isSelected && isDark && styles.categoryButtonActiveDark,
                        { backgroundColor: `${category.color}${isDark ? '33' : '15'}` }
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Icon size={18} color={category.color} />
                      <Text style={[
                        styles.categoryButtonText,
                        isDark && styles.categoryButtonTextDark,
                        isSelected && styles.categoryButtonTextActive,
                        isSelected && isDark && styles.categoryButtonTextActiveDark
                      ]}>
                        {category.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <Pressable 
              style={[styles.submitButton, isDark && styles.submitButtonDark]} 
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Add Transaction</Text>
            </Pressable>
          </MotiView>
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 500,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 5,
  },
  modalContentDark: {
    backgroundColor: '#1F2937',
  },
  header: {
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
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  closeButtonDark: {
    backgroundColor: '#374151',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    height: 48,
    position: 'relative',
    overflow: 'hidden',
  },
  typeSelectorDark: {
    backgroundColor: '#374151',
  },
  typeSelectorBackground: {
    position: 'absolute',
    top: 4,
    width: '50%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  typeSelectorBackgroundDark: {
    backgroundColor: '#4B5563',
  },
  typeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  typeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
  },
  typeButtonTextDark: {
    color: '#9CA3AF',
  },
  typeButtonTextActive: {
    color: '#1F2937',
  },
  typeButtonTextActiveDark: {
    color: '#F9FAFB',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  labelDark: {
    color: '#9CA3AF',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  inputDark: {
    backgroundColor: '#374151',
    color: '#F9FAFB',
  },
  amountInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    gap: 6,
  },
  categoryButtonDark: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F3FF',
  },
  categoryButtonActiveDark: {
    borderColor: '#818CF8',
    backgroundColor: '#312E81',
  },
  categoryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
  },
  categoryButtonTextDark: {
    color: '#9CA3AF',
  },
  categoryButtonTextActive: {
    color: '#1F2937',
  },
  categoryButtonTextActiveDark: {
    color: '#F9FAFB',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDark: {
    backgroundColor: '#4F46E5',
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});