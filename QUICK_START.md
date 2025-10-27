# 🚀 Guia Rápido de Início

Este guia irá te ajudar a configurar rapidamente um novo e-commerce para um cliente.

## ⏱️ Tempo estimado: 15-20 minutos

---

## 📋 Pré-requisitos

Antes de começar, tenha em mãos:

### 1. Informações do Cliente
- [ ] Nome da loja
- [ ] Slug (ex: minhalojaonline)
- [ ] CNPJ
- [ ] Endereço completo
- [ ] Email de contato
- [ ] Telefone / WhatsApp
- [ ] Cores da marca (hexadecimal)

### 2. Domínios Configurados
- [ ] Domínio principal (ex: www.minhaloja.com.br)
- [ ] Subdomínio API (ex: api.minhaloja.com.br)
- [ ] Subdomínio CDN (ex: cdn.minhaloja.com.br)

### 3. Contas nos Serviços

#### Supabase
- [ ] Conta criada em https://supabase.com
- [ ] Novo projeto criado
- [ ] SUPABASE_URL anotada
- [ ] SUPABASE_ANON_KEY anotada

#### Algolia
- [ ] Conta criada em https://www.algolia.com
- [ ] Nova aplicação criada
- [ ] Índices criados:
  - [ ] produtos-site-{slug}
  - [ ] produtos-site-{slug}-preco_asc
  - [ ] produtos-site-{slug}-preco_desc
  - [ ] produtos-site-{slug}-nome_asc
  - [ ] produtos-site-{slug}-nome_desc
  - [ ] produtos-site-{slug}-estoque
- [ ] APP_ID anotado
- [ ] SEARCH_API_KEY anotada
- [ ] RECOMMEND_API_KEY anotada

#### API Backend
- [ ] API configurada e rodando
- [ ] API_URL anotada
- [ ] API_TOKEN anotado
- [ ] X_AUTH_TOKEN anotado

### 4. Assets do Cliente
- [ ] Logo colorida (formato PNG com fundo transparente)
- [ ] Logo branca (para fundos escuros)
- [ ] Favicon (ou logo para gerar favicons)

---

## 🎯 Passo a Passo

### Passo 1: Clonar o Template

```bash
cd ~/Sites
git clone <url-do-repositorio-template> nome-do-cliente
cd nome-do-cliente
```

### Passo 2: Executar Setup Automatizado

```bash
node setup.js
```

Responda todas as perguntas do assistente. Tenha as informações pré-requisitos em mãos.

**Dica:** Você pode copiar e colar as respostas para agilizar.

### Passo 3: Executar Substituição de Referências

```bash
node replace-references.js
```

Este script irá:
- Substituir todas as URLs hardcoded
- Atualizar referências ao nome da marca
- Configurar arquivos de API com variáveis de ambiente
- Atualizar índices Algolia
- Limpar assets específicos da Diva

### Passo 4: Adicionar Assets do Cliente

#### Logos
```bash
# Substitua estes arquivos:
cp /caminho/logo-colorida.png public/logo.png
cp /caminho/logo-branca.png public/logo-branca.png
```

#### Favicons

1. Acesse: https://realfavicongenerator.net/
2. Upload da logo do cliente
3. Baixe o pacote gerado
4. Extraia os arquivos em `public/favicon/`

```bash
# Extrair favicons baixados
unzip favicons.zip -d public/favicon/
```

### Passo 5: Instalar Dependências

```bash
npm install
```

### Passo 6: Testar Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

### Passo 7: Verificações Finais

Teste os seguintes pontos:

- [ ] Logo está aparecendo corretamente
- [ ] Favicon está correto
- [ ] Cores do tema estão aplicadas
- [ ] Nome da loja está correto em toda interface
- [ ] Links de redes sociais funcionam (se configurados)
- [ ] Login com Supabase funciona
- [ ] Busca Algolia retorna resultados
- [ ] Carrinho de compras funciona
- [ ] Checkout carrega corretamente

### Passo 8: Configurar Git

```bash
# Inicializar repositório (se ainda não foi)
git init

# Adicionar remote do GitLab
git remote add origin <url-do-repositorio-cliente>

# Primeiro commit
git add .
git commit -m "feat: Initial setup for <nome-do-cliente>"

# Push para o GitLab
git push -u origin main
```

### Passo 9: Deploy

#### Vercel (Recomendado)

1. Acesse: https://vercel.com
2. New Project → Import do repositório GitLab
3. Configure as variáveis de ambiente (copie do arquivo .env)
4. Deploy!

#### Outras Opções
- Netlify
- AWS Amplify
- Digital Ocean

---

## 🔧 Configurações Pós-Deploy

### DNS
Configure os seguintes registros:
```
www.minhaloja.com.br → CNAME para vercel
api.minhaloja.com.br → A record para servidor API
cdn.minhaloja.com.br → CNAME para CDN
```

### SSL
- Vercel configura automaticamente
- Para API e CDN, configure Let's Encrypt ou certificado próprio

### Analytics
Se o cliente quiser Google Analytics:
1. Crie propriedade no Google Analytics
2. Adicione o script em `src/app/layout.jsx`

---

## 📱 Funcionalidades Opcionais

### Apps Mobile
Se o cliente tiver apps:
- Configure `NEXT_PUBLIC_GOOGLE_PLAY_URL`
- Configure `NEXT_PUBLIC_APP_STORE_URL`

### Sistema de Comentários
Se quiser sistema de comentários:
1. Configure Cusdis: https://cusdis.com
2. Configure `NEXT_PUBLIC_COMMENTS_URL`
3. Configure `NEXT_PUBLIC_COMMENTS_APP_ID`

### Chat Online
Se quiser chat online:
1. Configure Standout ou similar
2. Configure `NEXT_PUBLIC_CHAT_SCRIPT_URL`

### Automações N8N
Para carrinho abandonado, etc:
1. Configure workflow no N8N
2. Configure `NEXT_PUBLIC_N8N_WEBHOOK_URL`

### reCAPTCHA
Para proteção contra bots:
1. Crie site v3 em https://www.google.com/recaptcha/admin
2. Configure `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

---

## 🐛 Problemas Comuns

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Imagens não carregam
Adicione o domínio em `next.config.mjs`:
```javascript
remotePatterns: [
  { protocol: "https", hostname: "seu-dominio.com" },
]
```

### Algolia não retorna produtos
1. Verifique se os índices foram criados
2. Popule os índices com produtos via API backend
3. Confirme que os nomes dos índices estão corretos no .env

### Build falha
Verifique todas as variáveis de ambiente obrigatórias no deploy.

---

## ✅ Checklist Final

Antes de entregar para o cliente:

### Funcionalidades
- [ ] Navegação funciona
- [ ] Busca retorna resultados
- [ ] Carrinho adiciona/remove produtos
- [ ] Checkout completo funciona
- [ ] Login/cadastro funcionam
- [ ] Área do cliente acessível
- [ ] Sistema de pagamento integrado

### Visual
- [ ] Logo correta
- [ ] Favicon correto
- [ ] Cores da marca aplicadas
- [ ] Responsivo (testar mobile)
- [ ] Imagens carregam corretamente

### SEO
- [ ] Títulos corretos
- [ ] Descrições corretas
- [ ] Open Graph configurado
- [ ] Sitemap gerado
- [ ] robots.txt configurado

### Performance
- [ ] Build sem erros
- [ ] Lighthouse score > 90
- [ ] Imagens otimizadas
- [ ] PWA funcional

### Segurança
- [ ] HTTPS habilitado
- [ ] reCAPTCHA configurado (se aplicável)
- [ ] Variáveis sensíveis não expostas
- [ ] Headers de segurança configurados

---

## 📞 Suporte

Em caso de dúvidas:
1. Consulte o [README.md](./README.md) completo
2. Verifique [ASSETS_INSTRUCTIONS.md](./ASSETS_INSTRUCTIONS.md)
3. Entre em contato com a equipe de desenvolvimento

---

## 🎉 Pronto!

Seu e-commerce está configurado e pronto para uso!

**Tempo médio:** 15-20 minutos
**Próximo cliente:** Repita o processo! 🚀

---

**Desenvolvido por TecWorks**
