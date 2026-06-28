import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function OrderSuccessScreen({ route, navigation }) {
  const message = route.params?.message || 'Pedido realizado com sucesso!';
  const isPending = message.toLowerCase().includes('análise');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, isPending && styles.iconCirclePending]}>
          <Ionicons
            name={isPending ? 'time' : 'checkmark'}
            size={56}
            color="#FFF"
          />
        </View>

        <Text style={styles.title}>
          {isPending ? 'Pagamento em Análise' : 'Pedido Confirmado!'}
        </Text>

        <Text style={styles.message}>{message}</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>Confirmação enviada ao seu e-mail</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="car-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>Prazo de entrega: 3 a 7 dias úteis</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="logo-whatsapp" size={20} color={colors.primary} />
            <Text style={styles.infoText}>Suporte via WhatsApp disponível</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.ordersBtn}
          onPress={() => navigation.navigate('Main', { screen: 'Pedidos' })}
          activeOpacity={0.85}
        >
          <Ionicons name="receipt-outline" size={20} color="#FFF" />
          <Text style={styles.ordersBtnText}>Ver Meus Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Main', { screen: 'Início' })}
          activeOpacity={0.85}
        >
          <Text style={styles.homeBtnText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  iconCirclePending: {
    backgroundColor: colors.secondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  infoBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    gap: 12,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  ordersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
    width: '100%',
    marginBottom: 12,
  },
  ordersBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  homeBtn: {
    paddingVertical: 14,
  },
  homeBtnText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
});
