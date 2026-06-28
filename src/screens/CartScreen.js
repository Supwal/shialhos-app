import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const VALID_COUPONS = {
  'SHIALHOS10': 10,
  'BEMVINDO15': 15,
  'FRETE20': 20,
};

export default function CartScreen({ navigation }) {
  const {
    items, subtotal, total, shipping, discountAmount,
    coupon, discount, updateQty, removeItem, applyCoupon, removeCoupon,
  } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      applyCoupon(code, VALID_COUPONS[code]);
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError('Cupom inválido ou expirado.');
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={22} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Carrinho</Text>
              <View style={{ width: 40 }} />
            </View>
          </SafeAreaView>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Carrinho vazio</Text>
          <Text style={styles.emptyDesc}>
            Adicione produtos para continuar
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('Produtos')}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyBtnText}>Ver Produtos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Carrinho ({items.length})</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Itens */}
        <View style={styles.section}>
          {items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemImage}>
                <Text style={styles.itemEmoji}>{item.imagePlaceholder}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemWeight}>{item.weight}</Text>
                <Text style={styles.itemPrice}>
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() =>
                    Alert.alert('Remover', `Remover "${item.name}" do carrinho?`, [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Remover', style: 'destructive', onPress: () => removeItem(item.id) },
                    ])
                  }
                >
                  <Ionicons name="trash-outline" size={16} color={colors.error} />
                </TouchableOpacity>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemTotal}>
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Frete grátis progress */}
        {subtotal < 150 && (
          <View style={styles.shippingProgress}>
            <View style={styles.shippingProgressHeader}>
              <Ionicons name="car-outline" size={18} color={colors.secondary} />
              <Text style={styles.shippingProgressText}>
                Faltam{' '}
                <Text style={{ fontWeight: '800', color: colors.primary }}>
                  R$ {(150 - subtotal).toFixed(2).replace('.', ',')}
                </Text>{' '}
                para frete grátis!
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min((subtotal / 150) * 100, 100)}%` },
                ]}
              />
            </View>
          </View>
        )}

        {shipping === 0 && subtotal > 0 && (
          <View style={styles.freeshippingBanner}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={styles.freeshippingText}>
              Você ganhou frete grátis!
            </Text>
          </View>
        )}

        {/* Cupom */}
        <View style={styles.couponSection}>
          <Text style={styles.couponLabel}>Cupom de desconto</Text>
          {coupon ? (
            <View style={styles.couponApplied}>
              <View style={styles.couponAppliedInfo}>
                <Ionicons name="pricetag" size={18} color={colors.primary} />
                <Text style={styles.couponAppliedText}>
                  {coupon} — {discount}% OFF
                </Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <Ionicons name="close-circle" size={22} color={colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.couponRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Digite o cupom"
                  placeholderTextColor={colors.textMuted}
                  value={couponInput}
                  onChangeText={(t) => { setCouponInput(t); setCouponError(''); }}
                  autoCapitalize="characters"
                />
                <TouchableOpacity style={styles.couponBtn} onPress={handleCoupon}>
                  <Text style={styles.couponBtnText}>Aplicar</Text>
                </TouchableOpacity>
              </View>
              {couponError ? (
                <Text style={styles.couponError}>{couponError}</Text>
              ) : null}
            </View>
          )}
        </View>

        {/* Resumo */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumo do pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              R$ {subtotal.toFixed(2).replace('.', ',')}
            </Text>
          </View>
          {discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.success }]}>
                Desconto ({discount}%)
              </Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                - R$ {discountAmount.toFixed(2).replace('.', ',')}
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frete</Text>
            <Text
              style={[
                styles.summaryValue,
                shipping === 0 && { color: colors.success, fontWeight: '700' },
              ]}
            >
              {shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              R$ {total.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Botão finalizar */}
      <View style={styles.footer}>
        <SafeAreaView edges={['bottom']}>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate('Checkout')}
            activeOpacity={0.85}
          >
            <Text style={styles.checkoutBtnText}>
              Finalizar Compra • R$ {total.toFixed(2).replace('.', ',')}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={colors.primaryDark} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyEmoji: { fontSize: 72, marginBottom: 16 },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  emptyBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    padding: 16,
    gap: 12,
  },
  cartItem: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemImage: {
    width: 64,
    height: 64,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: { fontSize: 32 },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 19,
  },
  itemWeight: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    minWidth: 22,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  shippingProgress: {
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shippingProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  shippingProgressText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 3,
  },
  freeshippingBanner: {
    marginHorizontal: 16,
    backgroundColor: '#E6F4E0',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#B8E0A8',
  },
  freeshippingText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  couponSection: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  couponLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  couponRow: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  couponBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  couponError: { color: colors.error, fontSize: 12, marginTop: 6 },
  couponApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6F4E0',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#B8E0A8',
  },
  couponAppliedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  couponAppliedText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  summary: {
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
  },
  checkoutBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
  },
});
