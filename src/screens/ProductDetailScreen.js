import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addItem, items, updateQty } = useCart();
  const [activeTab, setActiveTab] = useState('descricao');

  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{product.shortName}</Text>
            <TouchableOpacity
              style={styles.cartBtn}
              onPress={() => navigation.navigate('Carrinho')}
            >
              <Ionicons name="cart-outline" size={24} color="#FFF" />
              {quantity > 0 && (
                <View style={styles.cartDot} />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagem hero */}
        <View style={styles.imageHero}>
          <Text style={styles.imageEmoji}>{product.imagePlaceholder}</Text>
          {product.badge && (
            <View style={[styles.badge, { backgroundColor: product.badgeColor }]}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
          {discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}% OFF</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Nome e rating */}
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.weight}>{product.weight}</Text>

          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons
                key={s}
                name={s <= Math.floor(product.rating) ? 'star' : 'star-outline'}
                size={16}
                color={colors.secondary}
              />
            ))}
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewsText}>• {product.reviews} avaliações</Text>
          </View>

          {/* Preço */}
          <View style={styles.priceBox}>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </Text>
            )}
            <Text style={styles.price}>
              R$ {product.price.toFixed(2).replace('.', ',')}
            </Text>
            {discount && (
              <Text style={styles.saving}>
                Você economiza R$ {(product.originalPrice - product.price).toFixed(2).replace('.', ',')}
              </Text>
            )}
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {['descricao', 'ingredientes', 'conservacao'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab === 'descricao' ? 'Descrição' :
                   tab === 'ingredientes' ? 'Ingredientes' : 'Conservação'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabContent}>
            {activeTab === 'descricao' && (
              <Text style={styles.tabBody}>{product.description}</Text>
            )}
            {activeTab === 'ingredientes' && (
              <Text style={styles.tabBody}>{product.ingredients}</Text>
            )}
            {activeTab === 'conservacao' && (
              <Text style={styles.tabBody}>{product.conservacao}</Text>
            )}
          </View>

          {/* Info frete */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="car-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>Frete grátis acima de R$ 150</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>Compra 100% segura</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="leaf-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>Produto artesanal e natural</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer: controle de quantidade + botão */}
      <View style={styles.footer}>
        <SafeAreaView edges={['bottom']}>
          {quantity === 0 ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addItem(product)}
              activeOpacity={0.85}
            >
              <Ionicons name="cart-outline" size={20} color={colors.primaryDark} />
              <Text style={styles.addBtnText}>Adicionar ao Carrinho</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQty(product.id, quantity - 1)}
              >
                <Ionicons name="remove" size={22} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQty(product.id, quantity + 1)}
              >
                <Ionicons name="add" size={22} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cartNavBtn}
                onPress={() => navigation.navigate('Carrinho')}
                activeOpacity={0.85}
              >
                <Text style={styles.cartNavText}>Ver Carrinho</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.primaryDark} />
              </TouchableOpacity>
            </View>
          )}
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
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  cartBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  imageHero: {
    height: 260,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageEmoji: { fontSize: 100 },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  content: { padding: 20 },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  weight: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  priceBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
  },
  saving: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: { color: '#FFF' },
  tabContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBody: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoRow: {
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    minWidth: 32,
    textAlign: 'center',
  },
  cartNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  cartNavText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
});
