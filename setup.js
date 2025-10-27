#!/usr/bin/env node

/**
 * Script de Setup Inicial - E-commerce Template
 *
 * Este script configura um novo projeto de e-commerce a partir do template base.
 * Ele coleta informações do cliente e configura automaticamente:
 * - Variáveis de ambiente
 * - Informações da empresa
 * - Cores do tema
 * - Configurações de serviços (Supabase, Algolia, API)
 * - Package.json
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Armazena todas as configurações
const config = {};

// Função para fazer perguntas
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

// Função para validar URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Função para validar email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Função para validar cor hexadecimal
function isValidHexColor(color) {
  return /^#[0-9A-F]{6}$/i.test(color);
}

console.log('\n==========================================================');
console.log('  BEM-VINDO AO SETUP DO E-COMMERCE TEMPLATE');
console.log('==========================================================\n');
console.log('Este assistente irá configurar seu novo projeto de e-commerce.');
console.log('Responda às perguntas abaixo para personalizar a loja.\n');

async function collectBasicInfo() {
  console.log('\n--- INFORMAÇÕES BÁSICAS DA EMPRESA ---\n');

  config.STORE_NAME = await question('Nome da loja: ');
  config.STORE_SLUG = await question('Slug da loja (ex: minhalojaonline): ');
  config.STORE_DESCRIPTION = await question('Descrição da loja: ');

  let cnpj = await question('CNPJ (formato: 00.000.000/0000-00): ');
  config.CNPJ = cnpj;

  config.ADDRESS = await question('Endereço completo: ');
  config.CITY = await question('Cidade: ');
  config.STATE = await question('Estado (sigla): ');
  config.ZIP = await question('CEP: ');

  let email = '';
  while (!isValidEmail(email)) {
    email = await question('Email de contato: ');
    if (!isValidEmail(email)) {
      console.log('❌ Email inválido. Tente novamente.');
    }
  }
  config.CONTACT_EMAIL = email;

  config.PHONE = await question('Telefone principal: ');
  config.WHATSAPP = await question('WhatsApp (com DDI, ex: 5541987654321): ');
}

async function collectDomains() {
  console.log('\n--- DOMÍNIOS E URLs ---\n');

  let siteUrl = '';
  while (!isValidUrl(siteUrl)) {
    siteUrl = await question('URL do site (ex: https://www.minhaloja.com.br): ');
    if (!isValidUrl(siteUrl)) {
      console.log('❌ URL inválida. Inclua https://');
    }
  }
  config.SITE_URL = siteUrl.replace(/\/$/, ''); // Remove trailing slash

  let apiUrl = '';
  while (!isValidUrl(apiUrl)) {
    apiUrl = await question('URL da API (ex: https://api.minhaloja.com.br): ');
    if (!isValidUrl(apiUrl)) {
      console.log('❌ URL inválida. Inclua https://');
    }
  }
  config.API_URL = apiUrl.replace(/\/$/, '');

  let cdnUrl = '';
  while (!isValidUrl(cdnUrl)) {
    cdnUrl = await question('URL do CDN (ex: https://cdn.minhaloja.com.br): ');
    if (!isValidUrl(cdnUrl)) {
      console.log('❌ URL inválida. Inclua https://');
    }
  }
  config.CDN_URL = cdnUrl.replace(/\/$/, '');
}

async function collectThemeColors() {
  console.log('\n--- CORES DO TEMA ---\n');
  console.log('Informe as cores em formato hexadecimal (ex: #6950A2)\n');

  let primaryColor = '';
  while (!isValidHexColor(primaryColor)) {
    primaryColor = await question('Cor principal da marca: ');
    if (!isValidHexColor(primaryColor)) {
      console.log('❌ Cor inválida. Use formato #RRGGBB');
    }
  }
  config.PRIMARY_COLOR = primaryColor.toUpperCase();

  let primaryLight = '';
  while (!isValidHexColor(primaryLight)) {
    primaryLight = await question('Cor principal clara: ');
    if (!isValidHexColor(primaryLight)) {
      console.log('❌ Cor inválida. Use formato #RRGGBB');
    }
  }
  config.PRIMARY_LIGHT = primaryLight.toUpperCase();

  let primaryDark = '';
  while (!isValidHexColor(primaryDark)) {
    primaryDark = await question('Cor principal escura: ');
    if (!isValidHexColor(primaryDark)) {
      console.log('❌ Cor inválida. Use formato #RRGGBB');
    }
  }
  config.PRIMARY_DARK = primaryDark.toUpperCase();
}

async function collectSupabaseConfig() {
  console.log('\n--- CONFIGURAÇÃO SUPABASE ---\n');

  let supabaseUrl = '';
  while (!isValidUrl(supabaseUrl)) {
    supabaseUrl = await question('Supabase URL: ');
    if (!isValidUrl(supabaseUrl)) {
      console.log('❌ URL inválida.');
    }
  }
  config.SUPABASE_URL = supabaseUrl.replace(/\/$/, '');

  config.SUPABASE_ANON_KEY = await question('Supabase Anon Key: ');
}

async function collectAlgoliaConfig() {
  console.log('\n--- CONFIGURAÇÃO ALGOLIA ---\n');

  config.ALGOLIA_APP_ID = await question('Algolia App ID: ');
  config.ALGOLIA_SEARCH_API_KEY = await question('Algolia Search API Key: ');
  config.ALGOLIA_RECOMMEND_API_KEY = await question('Algolia Recommend API Key: ');
  config.ALGOLIA_INDEX_PREFIX = await question('Prefixo dos índices Algolia (ex: produtos-site-minhaloja): ');
}

async function collectApiConfig() {
  console.log('\n--- CONFIGURAÇÃO DA API ---\n');

  config.API_TOKEN = await question('Token da API Backend: ');
  config.API_X_AUTH_TOKEN = await question('X-Auth-Token da API: ');
}

async function collectRecaptchaConfig() {
  console.log('\n--- CONFIGURAÇÃO GOOGLE RECAPTCHA ---\n');

  const useRecaptcha = await question('Deseja usar Google reCAPTCHA v3? (s/n): ');

  if (useRecaptcha.toLowerCase() === 's' || useRecaptcha.toLowerCase() === 'sim') {
    config.RECAPTCHA_SITE_KEY = await question('reCAPTCHA Site Key: ');
  } else {
    config.RECAPTCHA_SITE_KEY = '';
  }
}

async function collectSocialMedia() {
  console.log('\n--- REDES SOCIAIS ---\n');

  config.INSTAGRAM_URL = await question('URL do Instagram (ou deixe vazio): ');
  config.FACEBOOK_URL = await question('URL do Facebook (ou deixe vazio): ');
  config.WHATSAPP_MESSAGE = await question('Mensagem padrão WhatsApp: ');
}

async function collectAppLinks() {
  console.log('\n--- LINKS DOS APLICATIVOS ---\n');

  config.ANDROID_APP_URL = await question('URL Google Play Store (ou deixe vazio): ');
  config.IOS_APP_URL = await question('URL Apple App Store (ou deixe vazio): ');
}

// Função para criar arquivo .env
function createEnvFile() {
  console.log('\n📝 Criando arquivo .env...');

  const envContent = `# Configurações do Site
NEXT_PUBLIC_STORE_NAME="${config.STORE_NAME}"
NEXT_PUBLIC_STORE_SLUG="${config.STORE_SLUG}"
NEXT_PUBLIC_SITE_URL=${config.SITE_URL}
NEXT_PUBLIC_API_URL=${config.API_URL}
NEXT_PUBLIC_CDN_URL=${config.CDN_URL}

# Informações da Empresa
NEXT_PUBLIC_CNPJ="${config.CNPJ}"
NEXT_PUBLIC_ADDRESS="${config.ADDRESS}"
NEXT_PUBLIC_CITY="${config.CITY}"
NEXT_PUBLIC_STATE="${config.STATE}"
NEXT_PUBLIC_ZIP="${config.ZIP}"
NEXT_PUBLIC_CONTACT_EMAIL=${config.CONTACT_EMAIL}
NEXT_PUBLIC_PHONE="${config.PHONE}"
NEXT_PUBLIC_WHATSAPP=${config.WHATSAPP}

# Supabase (Autenticação e Database)
NEXT_PUBLIC_SUPABASE_URL=${config.SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${config.SUPABASE_ANON_KEY}

# Algolia (Search e Recomendações)
NEXT_PUBLIC_ALGOLIA_APP_ID=${config.ALGOLIA_APP_ID}
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=${config.ALGOLIA_SEARCH_API_KEY}
NEXT_PUBLIC_ALGOLIA_RECOMMEND_API_KEY=${config.ALGOLIA_RECOMMEND_API_KEY}
NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX=${config.ALGOLIA_INDEX_PREFIX}

# API Backend
NEXT_PUBLIC_API_TOKEN=${config.API_TOKEN}
NEXT_PUBLIC_API_X_AUTH_TOKEN=${config.API_X_AUTH_TOKEN}

# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${config.RECAPTCHA_SITE_KEY}

# Redes Sociais
NEXT_PUBLIC_INSTAGRAM_URL=${config.INSTAGRAM_URL}
NEXT_PUBLIC_FACEBOOK_URL=${config.FACEBOOK_URL}
NEXT_PUBLIC_WHATSAPP_MESSAGE="${config.WHATSAPP_MESSAGE}"

# Links dos Aplicativos
NEXT_PUBLIC_ANDROID_APP_URL=${config.ANDROID_APP_URL}
NEXT_PUBLIC_IOS_APP_URL=${config.IOS_APP_URL}
`;

  fs.writeFileSync('.env', envContent);
  console.log('✅ Arquivo .env criado com sucesso!');
}

// Função para criar config.json com todas as configurações
function createConfigFile() {
  console.log('\n📝 Criando arquivo de configuração...');

  fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
  console.log('✅ Arquivo config.json criado com sucesso!');
}

// Função para atualizar package.json
function updatePackageJson() {
  console.log('\n📝 Atualizando package.json...');

  const packagePath = './package.json';
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  packageJson.name = `br.com.${config.STORE_SLUG}`;
  packageJson.description = config.STORE_DESCRIPTION;

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json atualizado!');
}

// Função para atualizar cores no style.constants.js
function updateStyleConstants() {
  console.log('\n🎨 Atualizando cores do tema...');

  const stylePath = './src/app/style.constants.js';
  let content = fs.readFileSync(stylePath, 'utf8');

  content = content.replace(/#cdb9e0/gi, config.PRIMARY_LIGHT);
  content = content.replace(/#6950A2/gi, config.PRIMARY_COLOR);
  content = content.replace(/#3b2768/gi, config.PRIMARY_DARK);

  fs.writeFileSync(stylePath, content);
  console.log('✅ Cores do tema atualizadas!');
}

// Função para atualizar ThemeRegistry
function updateThemeRegistry() {
  console.log('\n🎨 Atualizando tema Material-UI...');

  const themePath = './src/app/components/ThemeRegistry.jsx';
  let content = fs.readFileSync(themePath, 'utf8');

  content = content.replace(/#6950A2/gi, config.PRIMARY_COLOR);

  fs.writeFileSync(themePath, content);
  console.log('✅ Tema Material-UI atualizado!');
}

// Função para remover assets específicos da Diva
function cleanupAssets() {
  console.log('\n🧹 Limpando assets específicos da Diva...');

  const assetsToRemove = [
    './public/textura-diva.png',
    './public/diva-disponivel-na-app-store.png',
    './public/diva-disponivel-na-play-store.png',
    './public/sobre-diva.png',
    './public/rapunzel-ativos-diva-cosmeticos.jpg',
    './public/rapunzel-cronograma-de-crescimento-diva.jpg',
    './public/porque-rapunzel-perfeito-diva-cosmeticos.jpg',
    './public/Rapunzel-Tônico-Capilar-Diva-Cosmeticos-250ml.jpg',
    './public/DivaBanner.png',
    './public/popup-iphone-diva.png'
  ];

  assetsToRemove.forEach(asset => {
    if (fs.existsSync(asset)) {
      fs.unlinkSync(asset);
      console.log(`  ❌ Removido: ${asset}`);
    }
  });

  console.log('✅ Assets limpos!');
}

// Função principal
async function main() {
  try {
    await collectBasicInfo();
    await collectDomains();
    await collectThemeColors();
    await collectSupabaseConfig();
    await collectAlgoliaConfig();
    await collectApiConfig();
    await collectRecaptchaConfig();
    await collectSocialMedia();
    await collectAppLinks();

    console.log('\n==========================================================');
    console.log('  CONFIGURANDO PROJETO...');
    console.log('==========================================================\n');

    createEnvFile();
    createConfigFile();
    updatePackageJson();
    updateStyleConstants();
    updateThemeRegistry();
    cleanupAssets();

    console.log('\n==========================================================');
    console.log('  ✅ SETUP CONCLUÍDO COM SUCESSO!');
    console.log('==========================================================\n');
    console.log('Próximos passos:\n');
    console.log('1. Execute o script de substituição de código:');
    console.log('   node replace-references.js\n');
    console.log('2. Adicione seus logos e favicons na pasta public/\n');
    console.log('3. Revise o arquivo .env e ajuste se necessário\n');
    console.log('4. Instale as dependências:');
    console.log('   npm install\n');
    console.log('5. Inicie o servidor de desenvolvimento:');
    console.log('   npm run dev\n');

  } catch (error) {
    console.error('\n❌ Erro durante o setup:', error.message);
  } finally {
    rl.close();
  }
}

// Executar
main();
