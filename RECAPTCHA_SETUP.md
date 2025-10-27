# 🛡️ Configuração reCAPTCHA v3 - Diva Cosméticos

## 📋 Resumo

Sistema de proteção anti-bot invisível implementado usando Google reCAPTCHA v3 em:
- ✅ **Login** (quando usuário digita senha)
- ✅ **Cadastro** (criação de nova conta)
- ✅ **Checkout** (finalizar compra e criar orçamento)

## 🔑 Chaves Configuradas

### Frontend (Site Key - Pública)
```
6LdPQPErAAAAAKwWOgidLyeOfsJ7S6jiBh3TpON5
```
**Localização:** `/frontendv2/.env`

### Backend (Secret Key - PRIVADA)
```
6LdPQPErAAAAAHd6TIY5tG_2FtJFkC8xQN9h0bvh
```
**Localização:** `/backend/.env`

⚠️ **IMPORTANTE:** A Secret Key NUNCA deve ser exposta no frontend!

## 🎯 Como Funciona

### 1. Frontend
O token é gerado automaticamente e enviado ao backend:

```javascript
// Exemplo de como está implementado
const { executeRecaptcha } = useGoogleReCaptcha();

const recaptchaToken = await executeRecaptcha('checkout_payment');

// Token é enviado junto com os dados
const response = await api.post('/order', {
  ...dados,
  recaptchaToken
});
```

### 2. Backend
A API valida o token com o Google:

```javascript
const RecaptchaProvider = use('App/Providers/RecaptchaProvider');

const recaptchaResult = await RecaptchaProvider.validate(
  recaptchaToken,
  'checkout_payment', // Ação esperada
  0.5 // Score mínimo (0.0-1.0)
);

if (!recaptchaResult.valid) {
  return response.status(400).send({
    status: false,
    msg: 'Validação de segurança falhou.'
  });
}
```

## 📊 Sistema de Score

O reCAPTCHA v3 retorna um score de **0.0 a 1.0**:

- **1.0** = Muito provável que seja humano ✅
- **0.7-0.9** = Provavelmente humano ✅
- **0.5-0.6** = Incerto ⚠️
- **0.0-0.4** = Muito provável que seja bot ❌

### Score Mínimo Configurado: **0.5**

Você pode ajustar esse valor nos controllers:

```javascript
// Mais rigoroso (menos bots, mas pode bloquear alguns humanos)
await RecaptchaProvider.validate(token, 'checkout_payment', 0.7);

// Mais permissivo (aceita mais usuários, mas pode passar alguns bots)
await RecaptchaProvider.validate(token, 'checkout_payment', 0.3);
```

## 🔧 Arquivos Modificados

### Frontend
```
✅ src/app/(privado)/checkout/pagamento/page.jsx
✅ src/app/(user)/login/page.jsx
✅ src/app/(user)/cadastro/page.jsx
✅ .env
✅ package.json (react-google-recaptcha-v3)
```

### Backend
```
✅ app/Controllers/Http/OrderController.js
✅ app/Controllers/Http/CustomerController.js
✅ app/Providers/RecaptchaProvider.js (NOVO)
✅ .env
```

## 🚀 Testando

### 1. Teste de Desenvolvimento

O reCAPTCHA funciona mesmo em localhost! Para testar:

1. Acesse: http://localhost:3000/login
2. Digite um email e senha
3. Abra o DevTools (F12) → Console
4. Procure por: `RecaptchaProvider::validate`
5. Você verá o score retornado

### 2. Forçar Bloqueio (Para Teste)

Temporariamente aumente o score mínimo para 0.9:

```javascript
// Em OrderController.js
const recaptchaResult = await RecaptchaProvider.validate(
  recaptchaToken,
  'checkout_payment',
  0.9 // Vai bloquear quase tudo
);
```

### 3. Verificar Logs

Os logs mostram tudo:

```bash
# Backend
tail -f storage/logs/adonis.log | grep -i recaptcha
```

Você verá:
```
[INFO] RecaptchaProvider::validate => Validação bem-sucedida. Score: 0.9, Action: checkout_payment
```

## 🔒 Segurança

### ✅ Boas Práticas Implementadas

1. **Validação no Backend**: Token é verificado com Google antes de processar
2. **Action Matching**: Verifica se a ação bate (login, signup, checkout)
3. **Score Threshold**: Bloqueia scores baixos
4. **Timeout**: Requisições ao Google tem timeout de 5s
5. **Logs**: Todas as validações são logadas
6. **Fallback**: Se reCAPTCHA falhar, continua (para compatibilidade)

### ⚠️ Pontos de Atenção

1. **Rate Limiting**: Google limita requisições. Em produção, monitore.
2. **Score Variável**: Score pode variar mesmo para humanos reais.
3. **VPNs/Proxies**: Usuários com VPN podem ter score mais baixo.

## 📈 Monitoramento

### Painel do Google reCAPTCHA

1. Acesse: https://www.google.com/recaptcha/admin
2. Selecione: **divacosmeticos.com.br**
3. Veja métricas:
   - Requisições por dia
   - Score médio
   - Ações mais usadas
   - Tentativas bloqueadas

### Logs Importantes

```javascript
// Sucesso
Logger.info(`reCAPTCHA validado. Score: 0.9`);

// Bloqueio
Logger.warning(`reCAPTCHA inválido: Score muito baixo: 0.3 (mínimo: 0.5)`);

// Erro
Logger.error(`Erro ao validar reCAPTCHA: timeout`);
```

## 🛠️ Ajustes Recomendados

### 1. Score por Tipo de Ação

Diferentes ações podem ter scores diferentes:

```javascript
// Login: mais permissivo (usuários retornando)
await RecaptchaProvider.validate(token, 'login', 0.3);

// Cadastro: médio (novos usuários)
await RecaptchaProvider.validate(token, 'signup', 0.5);

// Checkout: mais rigoroso (proteção de fraude)
await RecaptchaProvider.validate(token, 'checkout_payment', 0.7);
```

### 2. Retry Logic

Para scores borderline, você pode dar segunda chance:

```javascript
if (!recaptchaResult.valid && recaptchaResult.score > 0.3) {
  // Score entre 0.3 e 0.5: pedir confirmação adicional
  return response.status(200).send({
    status: false,
    requireConfirmation: true,
    msg: 'Por favor, confirme que você não é um robô.'
  });
}
```

### 3. Bypass para Usuários Confiáveis

```javascript
// Clientes com histórico de compras
const cliente = await Cliente.find(data.cliente);
const pedidosAnteriores = await cliente.pedidos().count();

if (pedidosAnteriores > 5) {
  // Usuário confiável, aceita score mais baixo
  minScore = 0.3;
}
```

## 🐛 Troubleshooting

### Problema: "Sistema de segurança não está pronto"

**Causa:** Script do reCAPTCHA não carregou
**Solução:**
- Verifique conexão com internet
- Verifique se a chave está correta no `.env`
- Limpe cache do navegador

### Problema: "Validação de segurança falhou"

**Causa 1:** Score muito baixo
**Solução:** Usuário pode estar usando VPN, bot, ou automação

**Causa 2:** Token inválido/expirado
**Solução:** Tokens expiram em 2 minutos. Gere novo token.

**Causa 3:** Secret Key incorreta
**Solução:** Verifique a chave no `.env` do backend

### Problema: Erro "timeout"

**Causa:** API do Google não respondeu
**Solução:** Aumentar timeout ou implementar retry

```javascript
// Em RecaptchaProvider.js
timeout: 10000, // 10 segundos ao invés de 5
```

## 📱 Domínios Autorizados

Certifique-se que esses domínios estão no painel do Google:

- ✅ `divacosmeticos.com.br`
- ✅ `www.divacosmeticos.com.br`
- ✅ `localhost` (para desenvolvimento)

## 🔄 Próximos Passos

### Opcional: reCAPTCHA Enterprise

Para mais recursos:
- Machine Learning avançado
- Análise de fraude
- Métricas detalhadas

Migração: https://cloud.google.com/recaptcha-enterprise

### Opcional: Outras Proteções

- **Rate Limiting**: Limitar tentativas por IP
- **Fingerprinting**: Identificar dispositivos únicos
- **2FA**: Autenticação de dois fatores

## 📞 Suporte

- **Documentação Google:** https://developers.google.com/recaptcha/docs/v3
- **Painel Admin:** https://www.google.com/recaptcha/admin
- **Status API:** https://www.google.com/appsstatus/dashboard/

---

**Implementado em:** 2025-10-20
**Desenvolvedor:** Claude Code
**Versão:** 1.0
