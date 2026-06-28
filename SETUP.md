# ShiAlhos App — Guia de Configuração

## 1. Instalar dependências

```bash
cd ShiAlhos_app
npm install
```

## 2. Configurar MercadoPago

Edite o arquivo `src/services/mercadopago.js` e substitua:

```js
const MP_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';
```

**Como obter seu Access Token:**
1. Acesse https://www.mercadopago.com.br/developers/panel
2. Clique em "Suas integrações" → "Criar aplicação"
3. Nome: ShiAlhos App
4. Copie o **Access Token de PRODUÇÃO**
5. Para testes, use o Access Token de **SANDBOX**

## 3. Adicionar imagens dos produtos

Crie a pasta `assets/products/` e adicione as imagens:
- `alho-trufado.png`
- `alho-defumado.png`
- `alho-azeite.png`
- `alho-picante.png`
- `alho-negro.png`
- `kit-degustacao.png`

(Até adicionar as imagens reais, o app usa emojis como placeholder)

## 4. Rodar o app

```bash
# No simulador/emulador
npx expo start

# No celular físico (instale o Expo Go)
npx expo start --tunnel
```

## 5. Publicar na loja

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Build Android (APK/AAB)
eas build --platform android

# Build iOS
eas build --platform ios
```

## Cupons de teste

| Cupom | Desconto |
|-------|----------|
| SHIALHOS10 | 10% |
| BEMVINDO15 | 15% |
| FRETE20 | 20% |

## Estrutura do projeto

```
ShiAlhos_app/
├── App.js                    # Entrada da aplicação
├── src/
│   ├── context/
│   │   └── CartContext.js    # Estado global do carrinho
│   ├── data/
│   │   └── products.js       # Catálogo de produtos
│   ├── navigation/
│   │   └── AppNavigator.js   # Rotas e tabs
│   ├── screens/
│   │   ├── HomeScreen.js     # Tela inicial
│   │   ├── ProductsScreen.js # Catálogo com filtros
│   │   ├── ProductDetailScreen.js
│   │   ├── CartScreen.js     # Carrinho + cupom
│   │   ├── CheckoutScreen.js # Dados + endereço + MP
│   │   ├── OrdersScreen.js   # Histórico de pedidos
│   │   └── OrderSuccessScreen.js
│   ├── services/
│   │   ├── mercadopago.js    # Integração MP
│   │   └── orders.js         # AsyncStorage de pedidos
│   ├── components/
│   │   ├── ProductCard.js
│   │   └── CartBadge.js
│   └── theme/
│       └── colors.js         # Paleta verde/dourado
```
