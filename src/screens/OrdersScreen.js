import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { getOrders, STATUS_LABELS } from '../services/orders';

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async () => {
    const data = await getOrders();
    setOrders(data);
  }, []);

  useFocusEffect(useCallback(() => {
    loadOrders();
  }, [loadOrders]));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SafeAreaView edges={['top']}>
            <Text style={styles.headerTitle}>Meus Pedidos</Text>
          </SafeAreaView>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
          <Text style={styles.emptyDesc}>
            Seus pedidos aparecerão aqui após a compra
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Produtos')}
            activeOpacity={0.85}
          >
            <Text style={styles.shopBtnText}>Comprar Agora</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <Text style={styles.headerTitle}>Meus Pedidos</Text>
          <Text style={styles.headerSub}>{orders.length} pedido{orders.length !== 1 ? 's' : ''}</Text>
        </SafeAreaView>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
        renderItem={({ item }) => {
          const statusInfo = STATUS_LABELS[item.status] || STATUS_LABELS.pending;
          return (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => navigation.navigate('PedidoDetalhe', { order: item })}
              activeOpacity={0.9}
            >
              {/* Header do card */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>{item.id}</Text>
                  <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
                  <Ionicons name={statusInfo.icon} size={14} color={statusInfo.color} />
                  <Text style={[styles.statusText, { color: statusInfo.color }]}>
                    {statusInfo.label}
                  </Text>
                </View>
              </View>

              {/* Itens */}
              <View style={styles.cardItems}>
                {item.items.slice(0, 2).map((p) => (
                  <View key={p.id} style={styles.cardItem}>
                    <Text style={styles.cardItemEmoji}>{p.imagePlaceholder}</Text>
                    <Text style={styles.cardItemName} numberOfLines={1}>
                      {p.quantity}x {p.name}
                    </Text>
                    <Text style={styles.cardItemPrice}>
                      R$ {(p.price * p.quantity).toFixed(2).replace('.', ',')}
                    </Text>
                  </View>
                ))}
                {item.items.length > 2 && (
                  <Text style={styles.moreItems}>
                    +{item.items.length - 2} item{item.items.length - 2 !== 1 ? 's' : ''}
                  </Text>
                )}
              </View>

              {/* Footer do card */}
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardFooterLabel}>Total pago</Text>
                  <Text style={styles.cardFooterTotal}>
                    R$ {item.total.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
                <View style={styles.cardFooterRight}>
                  <Text style={styles.viewDetails}>Ver detalhes</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    paddingTop: 8,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
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
  shopBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  shopBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  list: {
    padding: 16,
    gap: 14,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  orderDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardItems: {
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardItemEmoji: { fontSize: 20 },
  cardItemName: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
  cardItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  moreItems: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
  },
  cardFooterLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  cardFooterTotal: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary,
  },
  cardFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetails: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
});
