import { View, Text, StyleSheet, TextInput, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Building2, TrendingUp, Wallet } from 'lucide-react-native';
import { useState } from 'react';
import { MotiView } from 'moti';
import { useThemeStore } from '../store/useThemeStore';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
} from 'react-native-reanimated';

const accountTypes = [
  { id: 'bank', name: 'Bank Account', icon: Building2, color: '#6366F1' },
  { id: 'investment', name: 'Investment', icon: TrendingUp, color: '#16A34A' },
  { id: 'crypto', name: 'Crypto', icon: Wallet, color: '#9333EA' },
] as const;

interface AddAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (account: {
    type: 'bank' | 'investment' | 'crypto';
    name: string;
    balance: number;
    institution: string;
    lastFour?: string;
  }) => void;
}

export default function AddAccountModal({ visible, onClose, onAdd }: AddAccountModalProps) {
  const { isDark } = useThemeStore();
  const [type, setType] = useState<'bank' | 'investment' | 'crypto'>('bank');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [institution, setInstitution] = useState('');
  const [lastFour, setLastFour] = useState('');
  const [error, setError] = useState<string | null>(null);
  const position = useSharedValue(0);

  const handleTypeChange = (newType: 'bank' | 'investment' | 'crypto') => {
    const index = accountTypes.findIndex(t => t.id === newType);
    position.value = withSpring(index * (100 / 3), {
      damping: 15,
      stiffness: 300,
    });
    setType(newType);
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: `${position.value}%`,
    }],
  }));

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter an account name');
      return;
    }
    if (!balance || isNaN(parseFloat(balance))) {
      setError('Please enter a valid balance');
      return;
    }
    if (!institution.trim()) {
      setError('Please enter an institution name');
      return;
    }
    if (type === 'bank' && (!lastFour.trim() || lastFour.length !== 4)) {
      setError('Please enter the last 4 digits of the account');
      return;
    }

    onAdd({
      type,
      name: name.trim(),
      balance: parseFloat(balance),
      institution: institution.trim(),
      ...(type === 'bank' ? { lastFour: lastFour.trim() } : {}),
    });

    setName('');
    setBalance('');
    setInstitution('');
    setLastFour('');
    setError(null);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      {Platform.OS === 'web' ? (
        <View style={[
          StyleSheet.absoluteFill,
          styles.webBlur,
          isDark && styles.webBlurDark
        ]} />
      ) : (
        <BlurView 
          intensity={20} 
          style={StyleSheet.absoluteFill} 
          tint={isDark ? "dark" : "light"}
        />
      )}
      
      <MotiView
        style={[StyleSheet.absoluteFill, styles.modalWrapper]}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'timing', duration: 200 }}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        
        <MotiView
          from={{ opacity: 0, scale: 0.95, translateY: 10 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          exit={{ opacity: 0, scale: 0.95, translateY: 10 }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 300,
          }}
          style={[styles.modalContent, isDark && styles.modalContentDark]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, isDark && styles.titleDark]}>Add Account</Text>
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
              { width: `${100 / 3}%` },
              indicatorStyle,
            ]} />
            {accountTypes.map((accountType) => {
              const Icon = accountType.icon;
              return (
                <Pressable
                  key={accountType.id}
                  style={styles.typeButton}
                  onPress={() => handleTypeChange(accountType.id)}
                >
                  <Icon 
                    size={20} 
                    color={type === accountType.id 
                      ? (isDark ? '#F9FAFB' : '#1F2937')
                      : (isDark ? '#9CA3AF' : '#6B7280')
                    } 
                  />
                </Pressable>
              );
            })}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Account Name</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Enter account name"
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              value={name}
              onChangeText={(text) => {
                setError(null);
                setName(text);
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Balance</Text>
            <TextInput
              style={[styles.amountInput, isDark && styles.inputDark]}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              value={balance}
              onChangeText={(text) => {
                setError(null);
                setBalance(text.replace(/[^0-9.]/g, ''));
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Institution</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Enter institution name"
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              value={institution}
              onChangeText={(text) => {
                setError(null);
                setInstitution(text);
              }}
            />
          </View>

          {type === 'bank' && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, isDark && styles.labelDark]}>Last 4 Digits</Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Enter last 4 digits"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={lastFour}
                onChangeText={(text) => {
                  setError(null);
                  setLastFour(text.replace(/[^0-9]/g, '').slice(0, 4));
                }}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          )}

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Pressable 
            style={[styles.submitButton, isDark && styles.submitButtonDark]} 
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Add Account</Text>
          </Pressable>
        </MotiView>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  webBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
  },
  webBlurDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalWrapper: {
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
    left: 4,
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