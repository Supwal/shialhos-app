import React, { useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import CartBadge from '../components/CartBadge';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const { width } = Dimensions.get('window');

const BANNERS = [
  {
    id: '1',
    title: 'Frete Grátis',
    subtitle: 'Acima de R$ 150,00',
    bg: colors.primaryDark,
    icon: 'car-outline',
  },
  {
    id: '2',
    title: 'Alho Trufado',
    subtitle: 'O mais vendido chegou!',
    bg: '#7B3F00',
    icon: 'star-outline',
  },
  {
    id: '3',
    title: 'Kit Família',
    subtitle: '3 potes com desconto',
    bg: colors.secondaryDark,
    icon: 'gift-outline',
  },
];

export default function HomeScreen({ navigation }) {
  const { totalItems } = useCart();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerBg = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: ['transparent', colors.primaryDark],
    extrapolate: 'clamp',
  });

  const featuredProducts = products.slice(0, 4);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header flutuante */}
      <Animated.View style={[styles.header, { backgroundColor: headerBg }]}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerBrand}>ShiAlhos</Text>
              <Text style={styles.headerSub}>Sabor artesanal na sua mesa</Text>
            </View>
            <TouchableOpacity
              style={styles.cartBtn}
              onPress={() => navigation.navigate('Carrinho')}
              activeOpacity={0.8}
            >
              <Ionicons name="cart-outline" size={26} color="#FFF" />
              <CartBadge count={totalItems} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero banner */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🧄</Text>
          <Text style={styles.heroTitle}>Potes de Alho{'\n'}Artesanal</Text>
          <Text style={styles.heroSubtitle}>
            Produzido com amor, sem conservantes.{'\n'}Do campo direto para sua cozinha.
          </Text>
          <TouchableOpacity
            style={styles.heroCTA}
            onPress={() => navigation.navigate('Produtos')}
            activeOpacity={0.85}
          >
            <Text style={styles.heroCTAText}>Ver Produtos</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Cards de benefícios */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannersScroll}
        >
          {BANNERS.map((b) => (
            <View key={b.id} style={[styles.bannerCard, { backgroundColor: b.bg }]}>
              <Ionicons name={b.icon} size={28} color={colors.secondary} />
              <Text style={styles.bannerTitle}>{b.title}</Text>
              <Text style={styles.bannerSub}>{b.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Seção destaque */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mais Vendidos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Produtos')}>
              <Text style={styles.sectionLink}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onPress={() => navigation.navigate('Produto', { product: p })}
              />
            ))}
          </View>
        </View>

        {/* Banner frete grátis */}
        <View style={styles.shippingBanner}>
          <Ionicons name="car" size={32} color={colors.secondary} />
          <View style={styles.shippingText}>
            <Text style={styles.shippingTitle}>Frete Grátis</Text>
            <Text style={styles.shippingDesc}>
              Para compras acima de R$ 150,00 em todo o Brasil
            </Text>
          </View>
        </View>

        {/* Sobre */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Por que ShiAlhos?</Text>
          <View style={styles.aboutGrid}>
            {[
              { icon: 'leaf-outline', title: 'Natural', desc: 'Sem conservantes ou aditivos' },
              { icon: 'ribbon-outline', title: 'Artesanal', desc: 'Produção cuidadosa e limitada' },
              { icon: 'shield-checkmark-outline', title: 'Qualidade', desc: 'Selecionamos os melhores alhos' },
              { icon: 'heart-outline', title: 'Amor', desc: 'Feito com carinho e dedicação' },
            ].map((item) => (
              <View key={item.title} style={styles.aboutCard}>
                <View style={styles.aboutIconBox}>
                  <Ionicons name={item.icon} size={24} color={colors.primary} />
                </View>
                <Text style={styles.aboutCardTitle}>{item.title}</Text>
                <Text style={styles.aboutCardDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  headerBrand: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  cartBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    backgroundColor: colors.primaryDark,
    paddingTop: 120,
    paddingBottom: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
    gap: 8,
  },
  heroCTAText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '800',
  },
  bannersScroll: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  bannerCard: {
    width: 160,
    padding: 16,
    borderRadius: 16,
    gap: 6,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shippingBanner: {
    margin: 16,
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  shippingText: {
    flex: 1,
  },
  shippingTitle: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: '800',
  },
  shippingDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
  },
  aboutSection: {
    padding: 16,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  aboutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  aboutCard: {
    width: (width - 44) / 2,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  aboutIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  aboutCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  aboutCardDesc: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
