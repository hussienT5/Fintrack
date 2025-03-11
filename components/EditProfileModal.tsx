import { View, Text, StyleSheet, TextInput, Pressable, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Camera, Upload } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { MotiView } from 'moti';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  initialName: string;
  initialImage: string;
  onSave: (name: string, imageUrl: string) => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1579621970592-4184d789f2c1?w=800&auto=format&fit=crop&q=60'
];

export default function EditProfileModal({ 
  visible, 
  onClose, 
  initialName,
  initialImage,
  onSave 
}: EditProfileModalProps) {
  const [name, setName] = useState(initialName);
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [error, setError] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    onSave(name, selectedImage);
    onClose();
  };

  if (!visible) return null;

  return (
    <KeyboardAvoidingView 
      style={StyleSheet.absoluteFill}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
      
      <MotiView
        style={StyleSheet.absoluteFill}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 300 }}
      >
        <View style={styles.modalContainer}>
          <MotiView
            from={{ 
              opacity: 0, 
              scale: 0.8, 
              translateY: 40 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              translateY: keyboardHeight ? -keyboardHeight * 0.5 : 0 
            }}
            transition={{ 
              type: 'spring', 
              damping: 20, 
              stiffness: 300 
            }}
            style={styles.modalContent}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Edit Profile</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#1F2937" />
              </Pressable>
            </View>

            <View style={styles.imageSection}>
              <View style={styles.currentImage}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.profileImage}
                />
                <View style={styles.uploadOverlay}>
                  <Upload size={24} color="#fff" />
                </View>
              </View>
              
              <View style={styles.avatarOptions}>
                <Text style={styles.sectionTitle}>Choose Avatar</Text>
                <View style={styles.avatarGrid}>
                  {SAMPLE_AVATARS.map((url, index) => (
                    <Pressable
                      key={index}
                      style={[
                        styles.avatarOption,
                        selectedImage === url && styles.selectedAvatar
                      ]}
                      onPress={() => setSelectedImage(url)}
                    >
                      <Image source={{ uri: url }} style={styles.avatarImage} />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError(null);
                }}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </Pressable>
          </MotiView>
        </View>
      </MotiView>
    </KeyboardAvoidingView>
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
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  currentImage: {
    position: 'relative',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOptions: {
    width: '100%',
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 12,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  avatarOption: {
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#6366F1',
  },
  avatarImage: {
    width: 60,
    height: 60,
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
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});