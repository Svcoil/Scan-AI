# Scan Fit IA

App mobile focado em registro rápido de peso com câmera + OCR, metas e histórico.

## Visão geral
O Scan Fit IA começou como web app e foi preparado para Android com Capacitor. O objetivo é reduzir fricção no acompanhamento de peso diário, com fluxo simples de captura, correção e confirmação.

## Funcionalidades atuais
- Captura de peso com câmera (OCR via Tesseract.js)
- Correção manual do valor detectado
- Histórico local dos últimos pesos
- Meta de peso com barra de progresso
- Onboarding de 3 passos
- Paywall e Pro em modo mock (validação de produto)
- Build Android via Capacitor

## Stack
- Front-end: HTML, CSS, JavaScript puro
- OCR: Tesseract.js (CDN)
- Mobile wrapper: Capacitor 8
- Plataforma alvo atual: Android

## Estrutura do projeto
- `index.html` → telas e fluxo visual
- `app.js` → lógica de câmera, OCR, histórico, meta, onboarding e Pro mock
- `estilos/style.css` → estilos principais
- `android/` → projeto nativo Android (Capacitor)
- `docs/releases/` → notas de release
- `docs/screenshots/` → guia de screenshots da loja

## Como rodar localmente (web)
1. Abra `index.html` em um navegador moderno.
2. Conceda permissão de câmera.
3. Faça o fluxo: escanear → capturar → confirmar.

## Android (Capacitor)
### Pré-requisitos
- Node.js 18+
- Android Studio instalado
- SDK Android configurado

### Comandos
```bash
npm install
npm run android:sync
npm run android:open
```

## Publicação e conteúdo de loja
- Política de privacidade: `PRIVACY_POLICY.md`
- Textos Play Store (PT-BR): `PLAY_STORE_TEXTOS.md`
- Data Safety (PT-BR): `PLAY_STORE_SEGURANCA_DADOS.md`
- Textos Play Store (EN-US): `PLAY_STORE_TEXTS_EN_US.md`
- Data Safety (EN-US): `PLAY_STORE_DATA_SAFETY_EN_US.md`

## Roadmap sugerido
- Substituir Pro mock por assinatura real (Google Play Billing)
- Criar backend para sincronização segura em nuvem
- Aumentar precisão OCR com pré-processamento de imagem
- Adicionar analytics de conversão (onboarding/paywall)

## Licença
Projeto interno SVCOIL. Definir licença pública antes de abrir contribuições externas.
