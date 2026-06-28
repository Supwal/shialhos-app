import axios from 'axios';

// =============================================
// CONFIGURAÇÃO MERCADO PAGO
// =============================================
// Substitua pelo seu Access Token de PRODUÇÃO:
// https://www.mercadopago.com.br/developers/panel
// =============================================
const MP_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE'; // ⚠️ Trocar antes de publicar
const MP_BASE_URL = 'https://api.mercadopago.com';

const mpApi = axios.create({
  baseURL: MP_BASE_URL,
  headers: {
    Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Idempotency-Key': `shialhos-${Date.now()}`,
  },
});

/**
 * Cria uma preferência de pagamento no MercadoPago (Checkout Pro)
 * Retorna a URL de pagamento para redirecionar o cliente
 */
export async function createPaymentPreference({ items, buyer, orderId }) {
  const mpItems = items.map((item) => ({
    id: item.id,
    title: item.name,
    description: `ShiAlhos - ${item.shortName} ${item.weight}`,
    picture_url: 'https://www.shialhos.com.br/logo.png',
    category_id: 'food',
    quantity: item.quantity,
    unit_price: parseFloat(item.price.toFixed(2)),
    currency_id: 'BRL',
  }));

  const body = {
    items: mpItems,
    payer: {
      name: buyer.name,
      email: buyer.email,
      phone: {
        area_code: buyer.phone?.slice(0, 2) || '11',
        number: buyer.phone?.slice(2) || '',
      },
      address: {
        street_name: buyer.address?.street || '',
        street_number: buyer.address?.number || '',
        zip_code: buyer.address?.cep || '',
      },
    },
    back_urls: {
      success: 'shialhos://checkout/success',
      failure: 'shialhos://checkout/failure',
      pending: 'shialhos://checkout/pending',
    },
    auto_return: 'approved',
    external_reference: orderId,
    statement_descriptor: 'SHIALHOS',
    payment_methods: {
      excluded_payment_types: [],
      installments: 12,
    },
    metadata: {
      app: 'shialhos-mobile',
      order_id: orderId,
    },
  };

  const response = await mpApi.post('/checkout/preferences', body);
  return {
    preferenceId: response.data.id,
    initPoint: response.data.init_point,       // Produção
    sandboxInitPoint: response.data.sandbox_init_point, // Testes
  };
}

/**
 * Consulta o status de um pagamento pelo ID externo (orderId)
 */
export async function getPaymentStatus(orderId) {
  const response = await mpApi.get('/v1/payments/search', {
    params: { external_reference: orderId, limit: 1 },
  });
  const payments = response.data?.results || [];
  if (payments.length === 0) return { status: 'not_found' };
  const payment = payments[0];
  return {
    paymentId: payment.id,
    status: payment.status,           // approved | pending | rejected
    statusDetail: payment.status_detail,
    method: payment.payment_method_id,
    amount: payment.transaction_amount,
  };
}

export const MP_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected',
  IN_PROCESS: 'in_process',
};
