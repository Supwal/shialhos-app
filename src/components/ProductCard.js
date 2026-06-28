import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function ProductCard({ product, onPress }) {
  const { addItem, items } = useCart();
  const inCart = items.find((i) => i.id === product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Badge */}
      {product.badge && (
        <View style={[styles.badge, { backgroundColor: product.badgeColor }]}>
          <Text style={styles.badgeText}>{product.badge}</Text>
        </View>
      )}

      {/* Imagem placeholder */}
      <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>{product.imagePlaceholder}</Text>
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.weight}>{product.weight}</Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color={colors.secondary} />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviews}>({product.reviews})</Text>
        </View>

        {/* Preço */}
        <View style={styles.priceRow}>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>
              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </Text>
          )}
          <Text style={styles.price}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        {/* Botão adicionar */}
        <TouchableOpacity
          style={[styles.addBtn, inCart && styles.addBtnActive]}
          onPress={() => addItem(product)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={inCart ? 'checkmark' : 'add'}
            size={16}
            color={colors.textLight}
          />
          <Text style={styles.addBtnText}>
            {inCart ? `${inCart.quantity} no carrinho` : 'Adicionar'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  imageContainer: {
    height: 120,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imagePlaceholder: {
    fontSize: 52,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: 2,
  },
  weight: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 2,
  },
  rating: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 2,
  },
  reviews: {
    fontSize: 10,
    color: colors.textMuted,
  },
  priceRow: {
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 11,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    gap: 4,
  },
  addBtnActive: {
    backgroundColor: colors.secondary,
  },
  addBtnText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '700',
  },
});
