#!/usr/bin/env node

/**
 * Script de Substituição de Referências
 *
 * Este script substitui todas as referências hardcoded da Diva Cosméticos
 * pelas configurações do novo cliente usando o arquivo config.json gerado pelo setup.js
 */

const fs = require('fs');
const path = require('path');

// Carregar configurações
let config;
try {
  config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch (error) {
  console.error('❌ Erro: Arquivo config.json não encontrado!');
  console.log('Execute primeiro: node setup.js');
  process.exit(1);
}

console.log('\n==========================================================');
console.log('  SUBSTITUINDO REFERÊNCIAS NO CÓDIGO');
console.log('==========================================================\n');

// Função para substituir em arquivo
function replaceInFile(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    replacements.forEach(({ from, to }) => {
      if (content.includes(from)) {
        content = content.split(from).join(to);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

// Função recursiva para processar diretório
function processDirectory(dir, replacements, extensions = ['.js', '.jsx', '.json']) {
  const files = fs.readdirSync(dir);
  let filesChanged = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Ignorar node_modules, .next, .git
      if (!['node_modules', '.next', '.git', '.claude'].includes(file)) {
        filesChanged += processDirectory(filePath, replacements, extensions);
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        if (replaceInFile(filePath, replacements)) {
          filesChanged++;
          console.log(`  ✓ ${filePath}`);
        }
      }
    }
  });

  return filesChanged;
}

// 1. SUBSTITUIR URLs E DOMÍNIOS
console.log('1️⃣  Substituindo URLs e domínios...\n');

const urlReplacements = [
  { from: 'https://www.divacosmeticos.com.br', to: config.SITE_URL },
  { from: 'https://api.divacosmeticos.com.br', to: config.API_URL },
  { from: 'https://cdn.divacosmeticos.com.br', to: config.CDN_URL },
  { from: 'divacosmeticos.com.br', to: new URL(config.SITE_URL).hostname },
];

let changed = processDirectory('./src', urlReplacements);
console.log(`\n✅ ${changed} arquivos atualizados!\n`);

// 2. SUBSTITUIR INFORMAÇÕES DA EMPRESA
console.log('2️⃣  Substituindo informações da empresa...\n');

const companyReplacements = [
  { from: '49.212.829/0001-47', to: config.CNPJ },
  { from: 'sac@divacosmeticos.com.br', to: config.CONTACT_EMAIL },
];

changed = processDirectory('./src', companyReplacements);
console.log(`\n✅ ${changed} arquivos atualizados!\n`);

// 3. SUBSTITUIR NOME DA MARCA
console.log('3️⃣  Substituindo nome da marca...\n');

const brandReplacements = [
  { from: '"Diva Cosméticos"', to: `"${config.STORE_NAME}"` },
  { from: "'Diva Cosméticos'", to: `'${config.STORE_NAME}'` },
  { from: 'Diva Cosméticos', to: config.STORE_NAME },
  { from: 'name: "Diva"', to: `name: "${config.STORE_NAME}"` },
  { from: "name: 'Diva'", to: `name: '${config.STORE_NAME}'` },
];

changed = processDirectory('./src', brandReplacements);
console.log(`\n✅ ${changed} arquivos atualizados!\n`);

// 4. ATUALIZAR ARQUIVOS DE API COM VARIÁVEIS DE AMBIENTE
console.log('4️⃣  Atualizando arquivos de API...\n');

// Atualizar api.js
const apiPath = './src/app/lib/api.js';
if (fs.existsSync(apiPath)) {
  let apiContent = fs.readFileSync(apiPath, 'utf8');

  // Substituir URL hardcoded por variável de ambiente
  apiContent = apiContent.replace(
    /this\.url = ["']https:\/\/api\.divacosmeticos\.com\.br["']/g,
    'this.url = process.env.NEXT_PUBLIC_API_URL'
  );

  // Substituir token hardcoded por variável de ambiente
  apiContent = apiContent.replace(
    /constructor\(token = ["'][^"']+["']\)/,
    'constructor(token = process.env.NEXT_PUBLIC_API_TOKEN)'
  );

  // Substituir X-Auth-Token hardcoded
  apiContent = apiContent.replace(
    /["']X-Auth-Token["']:\s*["'][^"']+["']/g,
    '"X-Auth-Token": process.env.NEXT_PUBLIC_API_X_AUTH_TOKEN'
  );

  fs.writeFileSync(apiPath, apiContent);
  console.log(`  ✓ ${apiPath}`);
}

// Atualizar algoliaRecommend.js
const algoliaRecommendPath = './src/app/lib/algoliaRecommend.js';
if (fs.existsSync(algoliaRecommendPath)) {
  let content = fs.readFileSync(algoliaRecommendPath, 'utf8');

  content = content.replace(
    /recommendClient\(["'][^"']+["'],\s*["'][^"']+["']\)/,
    'recommendClient(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_RECOMMEND_API_KEY)'
  );

  fs.writeFileSync(algoliaRecommendPath, content);
  console.log(`  ✓ ${algoliaRecommendPath}`);
}

// Atualizar algoliaInsights.js
const algoliaInsightsPath = './src/app/lib/algoliaInsights.js';
if (fs.existsSync(algoliaInsightsPath)) {
  let content = fs.readFileSync(algoliaInsightsPath, 'utf8');

  content = content.replace(
    /appId:\s*["'][^"']+["']/,
    'appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID'
  );

  content = content.replace(
    /apiKey:\s*["'][^"']+["']/,
    'apiKey: process.env.NEXT_PUBLIC_ALGOLIA_RECOMMEND_API_KEY'
  );

  fs.writeFileSync(algoliaInsightsPath, content);
  console.log(`  ✓ ${algoliaInsightsPath}`);
}

console.log('\n✅ Arquivos de API atualizados!\n');

// 5. ATUALIZAR ÍNDICES ALGOLIA
console.log('5️⃣  Atualizando índices Algolia...\n');

const algoliaIndexReplacements = [
  { from: '"produtos-site-diva"', to: '`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}`' },
  { from: "'produtos-site-diva'", to: '`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}`' },
  { from: '"produtos-site-diva-preco_asc"', to: '`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_asc`' },
  { from: '"produtos-site-diva-preco_desc"', to: '`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_desc`' },
  { from: '"produtos-site-diva-nome_asc"', to: '`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_asc`' },
  { from: '"produtos-site-diva-nome_desc"', to: '`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_desc`' },
  { from: '"produtos-site-diva-estoque"', to: '`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-estoque`' },
];

// Processar apenas funcoes.js
const funcoesPath = './src/app/lib/funcoes.js';
if (fs.existsSync(funcoesPath)) {
  let content = fs.readFileSync(funcoesPath, 'utf8');

  // Adicionar import do algoliasearch no topo se não existir
  if (!content.includes('import algoliasearch')) {
    content = 'import algoliasearch from "algoliasearch";\n' + content;
  }

  // Substituir criação do searchClient
  content = content.replace(
    /const searchClient = algoliasearch\(["'][^"']+["'],\s*["'][^"']+["']\)/,
    'const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY)'
  );

  // Substituir índices
  algoliaIndexReplacements.forEach(({ from, to }) => {
    content = content.split(from).join(to);
  });

  fs.writeFileSync(funcoesPath, content);
  console.log(`  ✓ ${funcoesPath}`);
}

console.log('\n✅ Índices Algolia atualizados!\n');

// 6. ATUALIZAR PWA MANIFEST
console.log('6️⃣  Atualizando PWA Manifest...\n');

const manifestPath = './public/favicon/site.webmanifest';
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.name = config.STORE_NAME;
  manifest.short_name = config.STORE_SLUG;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`  ✓ ${manifestPath}`);
}

console.log('\n✅ PWA Manifest atualizado!\n');

// 7. ATUALIZAR NEXT.CONFIG.MJS - Domínios de imagem
console.log('7️⃣  Atualizando next.config.mjs...\n');

const nextConfigPath = './next.config.mjs';
if (fs.existsSync(nextConfigPath)) {
  let content = fs.readFileSync(nextConfigPath, 'utf8');

  // Substituir domínios hardcoded
  content = content.replace(/hostname: "divacosmeticos\.com"/g, `hostname: "${new URL(config.SITE_URL).hostname}"`);
  content = content.replace(/hostname: "api\.divacosmeticos\.com"/g, `hostname: "${new URL(config.API_URL).hostname}"`);
  content = content.replace(/hostname: "cdn\.divacosmeticos\.com\.br"/g, `hostname: "${new URL(config.CDN_URL).hostname}"`);

  fs.writeFileSync(nextConfigPath, content);
  console.log(`  ✓ ${nextConfigPath}`);
}

console.log('\n✅ next.config.mjs atualizado!\n');

// 8. CRIAR ARQUIVO COM INSTRUÇÕES PARA ASSETS
console.log('8️⃣  Criando instruções para assets...\n');

const assetsInstructions = `# INSTRUÇÕES PARA SUBSTITUIÇÃO DE ASSETS

Após executar o setup, você precisa substituir os seguintes arquivos:

## LOGOS (OBRIGATÓRIO)
- public/logo.png - Logo colorida da loja
- public/logo-branca.png - Logo branca da loja

## FAVICONS (OBRIGATÓRIO)
Gere os favicons em https://realfavicongenerator.net/ e substitua:
- public/favicon/favicon.ico
- public/favicon/favicon.svg
- public/favicon/favicon-16x16.png
- public/favicon/favicon-32x32.png
- public/favicon/favicon-96x96.png
- public/favicon/apple-touch-icon.png
- public/favicon/android-chrome-192x192.png
- public/favicon/android-chrome-512x512.png
- public/favicon/mstile-150x150.png

## BANNERS E IMAGENS INSTITUCIONAIS (OPCIONAL)
Se você quiser adicionar imagens personalizadas:
- public/banners/ - Banners promocionais
- Qualquer outra imagem específica da sua marca

## FONTES CUSTOMIZADAS (OPCIONAL)
- public/fontes/ - Adicione fontes customizadas se necessário

## NOTA IMPORTANTE
Os arquivos específicos da Diva Cosméticos foram removidos automaticamente.
Certifique-se de adicionar os assets da sua nova loja!
`;

fs.writeFileSync('./ASSETS_INSTRUCTIONS.md', assetsInstructions);
console.log('  ✓ ASSETS_INSTRUCTIONS.md criado');

console.log('\n✅ Instruções criadas!\n');

// RESUMO FINAL
console.log('\n==========================================================');
console.log('  ✅ SUBSTITUIÇÃO CONCLUÍDA COM SUCESSO!');
console.log('==========================================================\n');
console.log('Resumo das alterações:\n');
console.log('✓ URLs e domínios atualizados');
console.log('✓ Informações da empresa substituídas');
console.log('✓ Nome da marca atualizado');
console.log('✓ Arquivos de API configurados com variáveis de ambiente');
console.log('✓ Índices Algolia atualizados');
console.log('✓ PWA Manifest configurado');
console.log('✓ next.config.mjs atualizado\n');

console.log('⚠️  AÇÕES NECESSÁRIAS:\n');
console.log('1. Leia o arquivo ASSETS_INSTRUCTIONS.md');
console.log('2. Substitua os logos e favicons');
console.log('3. Revise manualmente os seguintes arquivos:');
console.log('   - src/app/components/Lojas/index.jsx (lojas físicas)');
console.log('   - Componentes com textos específicos\n');
console.log('4. Execute: npm install');
console.log('5. Execute: npm run dev\n');
