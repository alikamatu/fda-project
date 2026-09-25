import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, Scan, RotateCcw } from 'lucide-react-native';
import axios from 'axios';
import { ScannerOverlay } from './components/ScannerOverlay';
import { ResultCard } from './components/ResultCard';

const { width, height } = Dimensions.get('window');

// Replace with your machine's IP for physical device testing
const API_URL = 'http://192.168.100.223:1000/verify'; 

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'VALID' | 'EXPIRED' | 'FAKE' | null>(null);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    if (scanned || loading) return;
    
    setScanned(true);
    setLoading(true);

    console.log(`[Scanner] Scanned ${type} with data: ${data}`);

    try {
      // The API expects qrData or serialNumber
      const response = await axios.post(API_URL, {
        qrData: data,
        location: 'Mobile App User', // Optional
      });

      console.log('[Scanner] API Response:', response.data);
      
      setStatus(response.data.status);
      setProduct(response.data.product);
    } catch (error: any) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error('[Scanner] API Error Response:', error.response.data);
        console.error('[Scanner] API Error Status:', error.response.status);
        setStatus('FAKE'); 
      } else if (error.request) {
        // The request was made but no response was received
        console.error('[Scanner] No response received. Check your network/API URL:', error.request);
        alert('Cannot connect to server. Ensure your phone and computer are on the same Wi-Fi.');
        setStatus(null);
        setScanned(false);
      } else {
        console.error('[Scanner] Error Setting up Request:', error.message);
        setStatus('FAKE');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setStatus(null);
    setProduct(null);
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.infoText}>Requesting camera permission...</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScannerOverlay />

      <SafeAreaView style={styles.uiContainer}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>FDA Verify</Text>
          <Text style={styles.appSubtitle}>Scan product QR code to verify</Text>
        </View>

        <View style={styles.footer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.loadingText}>Verifying Authenticity...</Text>
            </View>
          ) : (
            <View style={styles.hintContainer}>
              <Scan size={20} color="rgba(255,255,255,0.7)" />
              <Text style={styles.hintText}>Focus QR code within the frame</Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      <ResultCard 
        status={status} 
        product={product} 
        onClose={resetScanner} 
      />

      {scanned && !status && !loading && (
        <TouchableOpacity style={styles.retryButton} onPress={resetScanner}>
          <RotateCcw size={20} color="#fff" />
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a192f',
  },
  uiContainer: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  hintText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    color: '#a8b2d1',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 3,
  },
});