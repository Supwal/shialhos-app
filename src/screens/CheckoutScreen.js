import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { createPaymentPreference } from '../services/mercadopago';
import { saveOrder, generateOrderId, ORDER_STATUS } from '../services/orders';

const STEPS = ['Dados', 'Endereço', 'Pagamento'];

export default function CheckoutScreen({ navigation }) {
  const { items, total, subtotal, shipping, discountAmount, coupon, clearCart } = useCart();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validateStep0 = () => {
    if (!form.name.trim()) return 'Informe seu nome';
    if (!form.email.includes('@')) return 'E-mail inválido';
    if (form.phone.replace(/\D/g, '').length < 10) return 'Telefone inválido';
    return null;
  };

  const validateStep1 = () => {
    if (form.cep.replace(/\D/g, '').length !== 8) return 'CEP inválido';
    if (!form.street.trim()) return 'Informe o logradouro';
    if (!form.number.trim()) return 'Informe o número';
    if (!form.city.trim()) return 'Informe a cidade';
    if (!form.state.trim()) return 'Informe o estado';
    return null;
  };

  const handleNext = () => {
    if (step === 0) {
      const err = validateStep0();
      if (err) { Alert.alert('Atenção', err); return; }
    }
    if (step === 1) {
      const err = validateStep1();
      if (err) { Alert.alert('Atenção', err); return; }
    }
    setStep((s) => s + 1);
  };

  const handlePay = async () => {
    try {
      setLoading(true);
      const orderId = generateOrderId();

      const { sandboxInitPoint, initPoint } = await createPaymentPreference({
        items,
        buyer: { ...form, address: form },
        orderId,
      });

      // Em desenvolvimento use sandboxInitPoint; em produção use initPoint
      const url = __DEV__ ? sandboxInitPoint : initPoint;

      // Salva pedido como pendente
      await saveOrder({
        id: orderId,
        items,
        buyer: form,
        subtotal,
        discountAmount,
        shipping,
        total,
        coupon,
        status: ORDER_STATUS.PENDING,
        createdAt: new Date().toISOString(),
      });

      setPaymentUrl(url);
    } catch (error) {
      Alert.alert(
        'Erro ao processar pagamento',
        'Verifique sua conexão e tente novamente.\n\nSe o problema persistir, entre em contato pelo WhatsApp.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentNav = ({ url }) => {
    if (!url) return;

    if (url.startsWith('shialhos://checkout/success') || url.includes('status=approved')) {
      clearCart();
      navigation.reset({
        index: 0,
        routes: [
          { name: 'Main' },
          {
            name: 'PedidoSucesso',
            params: { message: 'Pagamento aprovado! Obrigado pela compra.' },
          },
        ],
      });
      return false;
    }

    if (url.startsWith('shialhos://checkout/failure') || url.includes('status=rejected')) {
      setPaymentUrl(null);
      Alert.alert('Pagamento recusado', 'Tente outro método de pagamento.');
      return false;
    }

    if (url.startsWith('shialhos://checkout/pending') || url.includes('status=pending')) {
      clearCart();
      navigation.reset({
        index: 0,
        routes: [
          { name: 'Main' },
          {
            name: 'PedidoSucesso',
            params: { message: 'Pagamento em análise. Você receberá uma confirmação por e-mail.' },
          },
        ],
      });
      return false;
    }

    return true;
  };

  // WebView do MercadoPago
  if (paymentUrl) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.webHeader}>
          <SafeAreaView edges={['top']}>
            <View style={styles.webHeaderRow}>
              <TouchableOpacity onPress={() => setPaymentUrl(null)} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={22} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.mpLogo}>
                <Ionicons name="shield-checkmark" size={18} color={colors.secondary} />
                <Text style={styles.mpLogoText}>Pagamento Seguro</Text>
              </View>
              <View style={{ width: 40 }} />
            </View>
          </SafeAreaView>
        </View>
        <WebView
          source={{ uri: paymentUrl }}
          onShouldStartLoadWithRequest={handlePaymentNav}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.webLoading}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.webLoadingText}>Carregando MercadoPago...</Text>
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => (step > 0 ? setStep((s) => s - 1) : navigation.goBack())}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Finalizar Compra</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Progress steps */}
          <View style={styles.steps}>
            {STEPS.map((label, i) => (
              <View key={label} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    i <= step && styles.stepCircleActive,
                    i < step && styles.stepCircleDone,
                  ]}
                >
                  {i < step ? (
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        i <= step && styles.stepNumberActive,
                      ]}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    i <= step && styles.stepLabelActive,
                  ]}
                >
                  {label}
                </Text>
                {i < STEPS.length - 1 && (
                  <View style={[styles.stepLine, i < step && styles.stepLineDone]} />
                )}
              </View>
            ))}
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>

          {/* STEP 0: Dados pessoais */}
          {step === 0 && (
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Dados Pessoais</Text>
              <Field label="Nome completo" value={form.name} onChangeText={(v) => update('name', v)} placeholder="João da Silva" />
              <Field label="E-mail" value={form.email} onChangeText={(v) => update('email', v)} placeholder="joao@email.com" keyboard="email-address" />
              <Field label="Telefone / WhatsApp" value={form.phone} onChangeText={(v) => update('phone', v)} placeholder="(11) 99999-9999" keyboard="phone-pad" />
              <Field label="CPF" value={form.cpf} onChangeText={(v) => update('cpf', v)} placeholder="000.000.000-00" keyboard="numeric" />
            </View>
          )}

          {/* STEP 1: Endereço */}
          {step === 1 && (
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Endereço de Entrega</Text>
              <Field label="CEP" value={form.cep} onChangeText={(v) => update('cep', v)} placeholder="00000-000" keyboard="numeric" />
              <Field label="Logradouro" value={form.street} onChangeText={(v) => update('street', v)} placeholder="Rua, Avenida..." />
              <View style={styles.rowFields}>
                <View style={{ flex: 1 }}>
                  <Field label="Número" value={form.number} onChangeText={(v) => update('number', v)} placeholder="123" keyboard="numeric" />
                </View>
                <View style={{ flex: 2 }}>
                  <Field label="Complemento" value={form.complement} onChangeText={(v) => update('complement', v)} placeholder="Apto, Bloco..." />
                </View>
              </View>
              <Field label="Bairro" value={form.neighborhood} onChangeText={(v) => update('neighborhood', v)} placeholder="Centro" />
              <View style={styles.rowFields}>
                <View style={{ flex: 2 }}>
                  <Field label="Cidade" value={form.city} onChangeText={(v) => update('city', v)} placeholder="São Paulo" />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Estado" value={form.state} onChangeText={(v) => update('state', v.toUpperCase())} placeholder="SP" maxLength={2} />
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: Pagamento */}
          {step === 2 && (
            <View>
              <View style={styles.formSection}>
                <Text style={styles.formTitle}>Resumo do Pedido</Text>
                {items.map((item) => (
                  <View key={item.id} style={styles.summaryItem}>
                    <Text style={styles.summaryItemName} numberOfLines={1}>
                      {item.quantity}x {item.name}
                    </Text>
                    <Text style={styles.summaryItemPrice}>
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formTitle}>Totais</Text>
                {[
                  { label: 'Subtotal', value: `R$ ${subtotal.toFixed(2).replace('.', ',')}` },
                  discountAmount > 0 && { label: 'Desconto', value: `- R$ ${discountAmount.toFixed(2).replace('.', ',')}`, green: true },
                  { label: 'Frete', value: shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2).replace('.', ',')}`, green: shipping === 0 },
                ].filter(Boolean).map((row) => (
                  <View key={row.label} style={styles.totalRow}>
                    <Text style={styles.totalRowLabel}>{row.label}</Text>
                    <Text style={[styles.totalRowValue, row.green && { color: colors.success }]}>{row.value}</Text>
                  </View>
                ))}
                <View style={styles.totalDivider} />
                <View style={styles.totalRow}>
                  <Text style={styles.grandTotalLabel}>Total a pagar</Text>
                  <Text style={styles.grandTotalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
                </View>
              </View>

              <View style={styles.mpInfo}>
                <Ionicons name="shield-checkmark" size={24} color={colors.secondary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.mpInfoTitle}>Pagamento via MercadoPago</Text>
                  <Text style={styles.mpInfoDesc}>
                    Pix, cartão de crédito/débito, boleto e mais. 100% seguro e criptografado.
                  </Text>
                </View>
              </View>

              <View style={styles.deliveryInfo}>
                <Text style={styles.formTitle}>Entrega</Text>
                <Text style={styles.deliveryAddr}>
                  {form.street}, {form.number}{form.complement ? ` - ${form.complement}` : ''}{'\n'}
                  {form.neighborhood} — {form.city}/{form.state}{'\n'}
                  CEP: {form.cep}
                </Text>
                <TouchableOpacity onPress={() => setStep(1)}>
                  <Text style={styles.changeAddr}>Alterar endereço</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <SafeAreaView edges={['bottom']}>
          {step < 2 ? (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>
                {step === 0 ? 'Ir para Endereço' : 'Revisar Pedido'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color={colors.primaryDark} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextBtn, loading && styles.nextBtnLoading]}
              onPress={handlePay}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={colors.primaryDark} />
              ) : (
                <>
                  <Ionicons name="card-outline" size={20} color={colors.primaryDark} />
                  <Text style={styles.nextBtnText}>
                    Pagar R$ {total.toFixed(2).replace('.', ',')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </View>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboard, maxLength }) {
  return (
    <View style={fieldStyles.wrapper}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={fieldStyles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboard || 'default'}
        maxLength={maxLength}
        autoCorrect={false}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 20,
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
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  stepCircleActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  stepCircleDone: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  stepNumberActive: { color: colors.primaryDark },
  stepLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 6,
    fontWeight: '600',
  },
  stepLabelActive: { color: '#FFF' },
  stepLine: {
    width: 32,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 4,
  },
  stepLineDone: { backgroundColor: colors.secondaryLight },
  formContainer: { padding: 16 },
  formSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  rowFields: { flexDirection: 'row', gap: 10 },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  summaryItemName: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 8,
  },
  summaryItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalRowLabel: { fontSize: 14, color: colors.textSecondary },
  totalRowValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  totalDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  grandTotalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  mpInfo: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  mpInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  mpInfoDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 18,
  },
  deliveryInfo: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deliveryAddr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  changeAddr: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
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
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
  },
  nextBtnLoading: { opacity: 0.7 },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  webHeader: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  webHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  mpLogo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mpLogoText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  webLoading: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  webLoadingText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
