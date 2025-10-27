# 🛒 E-commerce Template - White Label

Template genérico de e-commerce baseado no projeto da Diva Cosméticos, pronto para ser replicado para novos clientes.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Serviços Externos Necessários](#serviços-externos-necessários)
- [Setup Inicial](#setup-inicial)
- [Configuração Manual](#configuração-manual)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)

---

## 🎯 Sobre o Projeto

Este é um template white-label de e-commerce desenvolvido em Next.js 15, totalmente configurável através de variáveis de ambiente e scripts de setup automatizados.

### ✨ Principais Funcionalidades

- ✅ Catálogo de produtos com busca avançada (Algolia)
- ✅ Carrinho de compras
- ✅ Checkout completo
- ✅ Autenticação de usuários (Supabase)
- ✅ Sistema de pagamento
- ✅ Área do cliente
- ✅ Sistema de promoções e outlet
- ✅ Busca por departamentos, marcas e categorias
- ✅ Recomendações de produtos (Algolia Recommend)
- ✅ PWA (Progressive Web App)
- ✅ SEO otimizado
- ✅ Responsivo (mobile-first)

---

## 🛠 Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca JavaScript
- **Material-UI v6** - Componentes UI
- **Emotion** - CSS-in-JS
- **Framer Motion** - Animações
- **Swiper** - Carrosséis

### Serviços Externos
- **Supabase** - Autenticação e banco de dados
- **Algolia** - Busca e recomendações de produtos
- **API Backend** - Node.js (não incluída neste repositório)
- **Google reCAPTCHA v3** - Proteção contra bots (opcional)

---

## 🔧 Serviços Externos Necessários

Antes de configurar o projeto, você precisa criar contas e configurar os seguintes serviços:

### 1. Supabase (Obrigatório)
- Acesse: https://supabase.com
- Crie um novo projeto
- Anote: `SUPABASE_URL` e `SUPABASE_ANON_KEY`

### 2. Algolia (Obrigatório)
- Acesse: https://www.algolia.com
- Crie uma aplicação
- Crie os seguintes índices:
  - `produtos-site-{slug}` (principal)
  - `produtos-site-{slug}-preco_asc`
  - `produtos-site-{slug}-preco_desc`
  - `produtos-site-{slug}-nome_asc`
  - `produtos-site-{slug}-nome_desc`
  - `produtos-site-{slug}-estoque`
- Anote: `APP_ID`, `SEARCH_API_KEY`, `RECOMMEND_API_KEY`

### 3. API Backend (Obrigatório)
- Configure sua API Node.js
- Anote: `API_URL`, `API_TOKEN`, `X_AUTH_TOKEN`

### 4. Google reCAPTCHA v3 (Opcional)
- Acesse: https://www.google.com/recaptcha/admin
- Crie um site v3
- Anote: `SITE_KEY`

### 5. CDN para Imagens (Recomendado)
- Configure um CDN (Cloudflare, CloudFront, etc.)
- Anote: `CDN_URL`

---

## 🚀 Setup Inicial

### Opção 1: Setup Automatizado (Recomendado)

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd ecommerce-template
```

2. Execute o script de setup interativo:
```bash
node setup.js
```

3. Responda às perguntas do assistente de configuração

4. Execute o script de substituição de referências:
```bash
node replace-references.js
```

5. Instale as dependências:
```bash
npm install
```

6. Adicione seus assets (logos, favicons) - veja [ASSETS_INSTRUCTIONS.md](./ASSETS_INSTRUCTIONS.md)

7. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### Opção 2: Configuração Manual

1. Clone o repositório

2. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas configurações

4. Atualize manualmente os arquivos necessários (veja seção abaixo)

5. Instale as dependências e rode o projeto

---

## ⚙️ Configuração Manual

Se optar por não usar os scripts automatizados, você precisará configurar manualmente:

### 1. Variáveis de Ambiente

Edite o arquivo `.env` com todas as informações da sua loja. Consulte `.env.example` para ver todas as variáveis disponíveis.

### 2. Cores do Tema

Edite os seguintes arquivos:

**src/app/style.constants.js:**
```javascript
export const Colors = {
  primaryLight: "#SUA_COR",
  primary: "#SUA_COR_PRINCIPAL",
  primaryDark: "#SUA_COR_ESCURA",
  // ...
};
```

**src/app/components/ThemeRegistry.jsx:**
```javascript
primary: {
  main: "#SUA_COR_PRINCIPAL",
},
```

### 3. Package.json

Atualize o nome do pacote:
```json
{
  "name": "br.com.seuclienteslug",
  "description": "Descrição da loja"
}
```

### 4. PWA Manifest

Edite `public/favicon/site.webmanifest`:
```json
{
  "name": "Nome da Loja",
  "short_name": "Slug"
}
```

### 5. Assets

Substitua os seguintes arquivos:
- `public/logo.png` - Logo colorida
- `public/logo-branca.png` - Logo branca
- `public/favicon/*` - Todos os favicons

Use o gerador: https://realfavicongenerator.net/

---

## 📁 Estrutura do Projeto

```
ecommerce-template/
├── src/
│   └── app/
│       ├── (privado)/          # Rotas protegidas (checkout)
│       ├── (user)/             # Área do usuário
│       ├── api/                # API routes
│       ├── components/         # Componentes React
│       ├── context/            # Context API
│       ├── hooks/              # Custom hooks
│       ├── lib/                # Bibliotecas e utilitários
│       ├── departamento/       # Páginas de departamento
│       ├── busca/              # Páginas de busca
│       ├── marca/              # Páginas de marca
│       └── [slug]/             # Páginas dinâmicas de produtos
├── public/                     # Assets estáticos
│   ├── animations/             # Arquivos Lottie
│   ├── banners-feira/          # Banners promocionais
│   ├── favicon/                # Ícones PWA
│   └── fontes/                 # Fontes customizadas
├── .env                        # Variáveis de ambiente (não commitar)
├── .env.example                # Exemplo de variáveis
├── setup.js                    # Script de setup automatizado
├── replace-references.js       # Script de substituição
└── README.md                   # Documentação
```

---

## 🎨 Personalização

### Cores

As cores principais são definidas em:
- `src/app/style.constants.js` - Constantes de cores
- `src/app/components/ThemeRegistry.jsx` - Tema Material-UI

### Fontes

A fonte padrão é **Jost**. Para alterar:
1. Adicione suas fontes em `public/fontes/`
2. Atualize em `src/app/components/ThemeRegistry.jsx`

### Lojas Físicas

Por padrão, o componente de lojas está vazio. Para adicionar lojas:
1. Crie uma tabela no Supabase ou arquivo JSON
2. Implemente o fetch em `src/app/components/Lojas/index.jsx`

---

## 🌐 Variáveis de Ambiente

### Obrigatórias

```env
NEXT_PUBLIC_STORE_NAME="Nome da Loja"
NEXT_PUBLIC_SITE_URL=https://www.sualojaonline.com.br
NEXT_PUBLIC_API_URL=https://api.sualojaonline.com.br
NEXT_PUBLIC_CDN_URL=https://cdn.sualojaonline.com.br
NEXT_PUBLIC_STORE_DESCRIPTION="Descrição para SEO"
NEXT_PUBLIC_STORE_KEYWORDS="palavras-chave, para, seo"
NEXT_PUBLIC_STORE_ADDRESS="Endereço completo"
NEXT_PUBLIC_STORE_CNPJ="00.000.000/0000-00"
NEXT_PUBLIC_CONTACT_EMAIL=contato@loja.com.br

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=SEU_APP_ID
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=sua-chave-aqui
NEXT_PUBLIC_ALGOLIA_RECOMMEND_API_KEY=sua-chave-aqui
NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX=produtos-site-slug

# API
NEXT_PUBLIC_API_TOKEN=seu-token-aqui
NEXT_PUBLIC_API_X_AUTH_TOKEN=seu-x-auth-token
```

### Opcionais

```env
# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# Redes Sociais
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_FACEBOOK_URL=
NEXT_PUBLIC_WHATSAPP_URL=

# Apps Mobile
NEXT_PUBLIC_GOOGLE_PLAY_URL=
NEXT_PUBLIC_APP_STORE_URL=

# Serviços Adicionais
NEXT_PUBLIC_COMMENTS_URL=
NEXT_PUBLIC_N8N_WEBHOOK_URL=
NEXT_PUBLIC_CHAT_SCRIPT_URL=
```

---

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Linting
npm run lint

# Setup inicial (interativo)
node setup.js

# Substituir referências hardcoded
node replace-references.js
```

---

## 🚢 Deploy

### Vercel (Recomendado)

1. Faça push do projeto para um repositório Git

2. Conecte o repositório na Vercel

3. Configure as variáveis de ambiente no dashboard da Vercel

4. Deploy automático será realizado

### Outros Provedores

O projeto é compatível com qualquer provedor que suporte Next.js:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Render
- Railway

---

## 📝 Checklist de Deploy

Antes de colocar em produção, verifique:

- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] Logos e favicons foram substituídos
- [ ] Cores do tema foram personalizadas
- [ ] Informações da empresa estão corretas
- [ ] Links de redes sociais estão funcionando
- [ ] Supabase está configurado corretamente
- [ ] Índices Algolia estão criados e populados
- [ ] API backend está rodando e acessível
- [ ] Domínios de imagem estão no next.config.mjs
- [ ] Google Analytics configurado (se aplicável)
- [ ] SSL/HTTPS habilitado
- [ ] PWA manifest configurado
- [ ] Robots.txt e sitemap.xml configurados

---

## 🔒 Segurança

### Importante

- **NUNCA** commite o arquivo `.env` no Git
- Use `.env.example` apenas com valores de exemplo
- Mantenha tokens e chaves de API seguros
- Use variáveis de ambiente em produção
- Habilite reCAPTCHA em formulários sensíveis

### Variáveis Sensíveis

As seguintes variáveis devem ser mantidas em segredo:
- `NEXT_PUBLIC_API_TOKEN`
- `NEXT_PUBLIC_API_X_AUTH_TOKEN`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY`
- `NEXT_PUBLIC_ALGOLIA_RECOMMEND_API_KEY`

---

## 🐛 Troubleshooting

### Erro: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: Imagens não carregam
Verifique se o domínio está em `next.config.mjs` → `images.remotePatterns`

### Erro: Algolia não retorna resultados
- Verifique se os índices estão criados
- Confirme que os nomes dos índices estão corretos
- Verifique as permissões das API keys

### Erro: Supabase authentication failed
- Confirme que a URL e a chave estão corretas
- Verifique se o projeto Supabase está ativo

---

## 📚 Documentação Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/material-ui/)
- [Supabase Documentation](https://supabase.com/docs)
- [Algolia Documentation](https://www.algolia.com/doc/)

---

## 🤝 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação
2. Verifique os arquivos de exemplo
3. Entre em contato com o desenvolvedor

---

## 📄 Licença

Este projeto é privado e de uso interno da TecWorks.

---

## 🎯 Próximos Passos

Após o setup inicial:

1. **Personalização Visual**
   - Ajuste cores e fontes
   - Adicione banners personalizados
   - Configure animações

2. **Conteúdo**
   - Popule o Algolia com produtos
   - Configure categorias e departamentos
   - Adicione marcas

3. **Funcionalidades Extras**
   - Implemente sistema de lojas físicas
   - Configure automações N8N
   - Integre sistema de comentários
   - Adicione chat online

4. **Otimizações**
   - Configure Google Analytics
   - Implemente tracking de conversões
   - Otimize imagens e performance
   - Configure cache

---

**Desenvolvido por TecWorks** 🚀
