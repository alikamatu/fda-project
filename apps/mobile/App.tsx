import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function App() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  // Main entrance animations
  useEffect(() => {
    // Rotation animation for the circle
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotate.start();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    return () => rotate.stop();
  }, []);

  // Interpolated rotation for the circle
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Animated background elements */}
      <Animated.View 
        style={[
          styles.circle,
          {
            transform: [{ rotate: rotateInterpolate }],
          }
        ]}
      />
      
      <Animated.View 
        style={[
          styles.circle2,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1]
            }),
          }
        ]}
      />

      <View style={styles.content}>
        {/* Main title with animations */}
        <Animated.Text 
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ],
            }
          ]}
        >
          Coming Soon
        </Animated.Text>

        {/* Subtitle with animation */}
        <Animated.Text 
          style={[
            styles.subtitle,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim }
              ],
            }
          ]}
        >
          Something amazing is on the way
        </Animated.Text>

        {/* Animated dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [0.7, 1]
                  }),
                }
              ]}
            />
          ))}
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                transform: [
                  { scaleX: pulseAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [0.3, 0.4]
                  })}
                ]
              }
            ]} 
          />
        </View>

        {/* Animated countdown or message */}
        <Animated.View 
          style={[
            styles.countdownContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.countdownText}>Stay tuned for launch</Text>
          <Text style={styles.countdownSubtext}>We're working hard to bring you an amazing experience</Text>
        </Animated.View>

        {/* Social links or contact info */}
        <Animated.View 
          style={[
            styles.contactContainer,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.8]
              }),
            }
          ]}
        >
          <Text style={styles.contactText}>Contact us: hello@yourapp.com</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a192f', // Dark blue background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  circle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    borderWidth: 2,
    borderColor: 'rgba(64, 224, 208, 0.1)',
    top: -width * 0.5,
    left: -width * 0.25,
  },
  circle2: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    borderWidth: 1,
    borderColor: 'rgba(64, 224, 208, 0.05)',
    bottom: -width * 0.3,
    right: -width * 0.3,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(64, 224, 208, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#a8b2d1',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '300',
    letterSpacing: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#40e0d0',
    marginHorizontal: 8,
  },
  progressContainer: {
    width: width * 0.7,
    height: 4,
    backgroundColor: 'rgba(168, 178, 209, 0.2)',
    borderRadius: 2,
    marginBottom: 40,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#40e0d0',
    width: '40%',
    borderRadius: 2,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  countdownText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1,
  },
  countdownSubtext: {
    fontSize: 14,
    color: '#a8b2d1',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
  },
  contactContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#64ffda',
    textAlign: 'center',
  },
});