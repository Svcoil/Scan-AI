# Segurança de Dados — respostas base (Scan Fit IA)

Use este guia para preencher a seção de Segurança de Dados no Play Console.

## 1) O app coleta ou compartilha dados?
Resposta sugerida (versão atual):
- Coleta de dados: Sim (dados inseridos pelo usuário no app)
- Compartilhamento com terceiros: Não

## 2) Tipos de dados
### Informações pessoais
- Não coleta nome real obrigatório
- Não coleta e-mail obrigatório (na versão atual)

### Saúde e condicionamento
- Peso corporal informado/capturado
- Meta de peso
- Histórico de peso

## 3) Esses dados são processados de forma opcional?
- Sim, fornecidos diretamente pelo usuário ao usar o app.

## 4) Os dados são criptografados em trânsito?
- Na versão atual, não há envio obrigatório para servidor do app.
- Se futuramente houver backend, habilitar HTTPS/TLS e atualizar este formulário.

## 5) O usuário pode solicitar exclusão de dados?
- Versão atual: dados locais podem ser removidos limpando dados do app no dispositivo.
- Se houver conta no futuro, incluir fluxo de exclusão por conta.

## 6) Uso de câmera
- A câmera é usada para captura da imagem da balança e leitura OCR.
- O uso depende de permissão concedida pelo usuário.

## 7) Finalidade do uso dos dados
- Funcionalidade do app (registro e exibição de progresso)
- Personalização básica da experiência

## 8) Vende dados?
- Não.

## 9) Observação importante
Ao evoluir para login, backup em nuvem, analytics ou assinatura real, revise este formulário antes de cada release.
