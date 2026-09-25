import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'N/A'}</Text>
  </View>
);

export const ProductInfo = ({ product }: { product: any }) => {
  if (!product) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Details</Text>
      <View style={styles.card}>
        <InfoRow label="Product Name" value={product.name} />
        <InfoRow label="Manufacturer" value={product.manufacturer} />
        <InfoRow label="Batch Code" value={product.batchNumber} />
        <InfoRow label="Manufacture Date" value={product.manufactureDate ? new Date(product.manufactureDate).toLocaleDateString() : undefined} />
        <View style={styles.divider} />
        <InfoRow label="Expires On" value={product.expiresAt ? new Date(product.expiresAt).toLocaleDateString() : undefined} />
        <InfoRow label="Days Remaining" value={product.remainingDays} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    width: '100%',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    marginLeft: 16,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  label: {
    fontSize: 16,
    color: '#EBEBF5',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  divider: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
});
