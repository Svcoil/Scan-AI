# Scan Fit IA

![version](https://img.shields.io/badge/version-v1.0.0-22c55e)
![status](https://img.shields.io/badge/status-MVP-blue)
![platform](https://img.shields.io/badge/platform-Android-3ddc84)
![stack](https://img.shields.io/badge/stack-JS%20%7C%20Capacitor-black)

App de registro de peso com câmera + OCR, foco em velocidade, simplicidade e evolução diária.

## Proposta de valor
- Registrar peso em segundos com captura por câmera.
- Acompanhar meta com progresso visual.
- Manter histórico rápido sem fricção.

## Funcionalidades atuais
- Captura de peso com câmera (OCR via Tesseract.js)
- Correção manual do valor detectado
- Histórico local dos pesos
- Meta de peso com barra de progresso
- Onboarding de 3 passos
- Paywall e Pro em modo mock (validação de produto)
- Build Android via Capacitor

## Screenshots
Checklist para adicionar imagens reais da Play Store:
- [ ] Home
- [ ] Câmera
- [ ] Resultado

Guia de captura: `docs/screenshots/README.md`.

## Stack
- Front-end: HTML, CSS, JavaScript puro
- OCR: Tesseract.js (CDN)
- Mobile wrapper: Capacitor 8
- Plataforma atual: Android

## Estrutura
- `index.html` → telas e fluxo visual
- `app.js` → câmera, OCR, histórico, meta, onboarding e Pro mock
- `estilos/style.css` → estilos principais
- `android/` → projeto nativo Android (Capacitor)
- `docs/releases/` → release notes
- `docs/screenshots/` → guia de screenshots

## Rodar localmente
### Web
1. Abra `index.html` em navegador moderno.
2. Conceda permissão de câmera.
3. Faça o fluxo: escanear → capturar → confirmar.

### Android (Capacitor)
Pré-requisitos: Node.js 18+, Android Studio, SDK Android configurado.

```bash
npm install
npm run android:sync
npm run android:open
```

## Conteúdo de publicação
- Política de privacidade: `PRIVACY_POLICY.md`
- Textos Play Store (PT-BR): `PLAY_STORE_TEXTOS.md`
- Data Safety (PT-BR): `PLAY_STORE_SEGURANCA_DADOS.md`
- Textos Play Store (EN-US): `PLAY_STORE_TEXTS_EN_US.md`
- Data Safety (EN-US): `PLAY_STORE_DATA_SAFETY_EN_US.md`

## Roadmap comercial
- Assinatura real com Google Play Billing
- Sincronização em nuvem com conta de usuário
- Melhorias de OCR por pré-processamento
- Analytics de funil (onboarding, paywall, retenção)

## Release atual
- Notas da v1.0.0: `docs/releases/v1.0.0.md`

## Licença
Projeto interno SVCOIL. Definir licença pública antes de abrir contribuições externas.
