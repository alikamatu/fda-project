import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ProductInfo } from './ProductInfo';

const { height } = Dimensions.get('window');

type Status = 'VALID' | 'EXPIRED' | 'FAKE' | null;

interface ResultCardProps {
  status: Status;
  product?: any;
  onClose: () => void;
}

export const ResultCard = ({ status, product, onClose }: ResultCardProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status) {
      // Trigger haptic feedback based on status
      if (status === 'VALID') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [status, slideAnim, fadeAnim]);

  if (!status) return null;

  const getConfig = () => {
    switch (status) {
      case 'VALID':
        return {
          colors: ['#34C759', '#248A3D'] as [string, string],
          icon: CheckCircle2,
          title: 'Authentic Product',
          subtitle: 'Verified by Global FDA Database',
          accent: '#34C759',
        };
      case 'EXPIRED':
        return {
          colors: ['#FF9500', '#C67100'] as [string, string],
          icon: AlertTriangle,
          title: 'Expired Product',
          subtitle: 'Do not consume or use',
          accent: '#FF9500',
        };
      case 'FAKE':
      default:
        return {
          colors: ['#FF3B30', '#A31D15'] as [string, string],
          icon: XCircle,
          title: 'Invalid Product',
          subtitle: 'Batch not found in registry',
          accent: '#FF3B30',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <Animated.View 
          style={[
            styles.card, 
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.handle} />
          
          <LinearGradient
            colors={config.colors}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.iconContainer}>
              <Icon size={48} color="#fff" />
            </View>
            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.subtitle}>{config.subtitle}</Text>
          </LinearGradient>

          <View style={styles.content}>
            {product && <ProductInfo product={product} />}
            
            {status === 'FAKE' && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  This product could not be verified. It may be counterfeit or not properly registered in our database.
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: config.accent }]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  card: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '85%',
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
  },
  header: {
    padding: 32,
    alignItems: 'center',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    fontWeight: '500',
  },
  content: {
    padding: 24,
    flex: 1,
  },
  warningBox: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    borderWidth: 1,
  },
  warningText: {
    color: '#FF453A',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    marginTop: 'auto',
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
