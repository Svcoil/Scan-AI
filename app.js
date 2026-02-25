const screens = document.querySelectorAll(".screen");

const scanBtn = document.querySelector("#home .primary-btn");
const captureBtn = document.querySelector(".capture-btn");
const confirmBtn = document.querySelector("#result .primary-btn");
const correctBtn = document.querySelector("#result .secondary-btn");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const photoPreview = document.getElementById("photoPreview");
const weightEl = document.querySelector(".weight");
const weightInput = document.querySelector(".weight-input");
const ocrStatus = document.getElementById("ocrStatus");
const loadingEl = document.getElementById("loading");
const weightHistoryEl = document.getElementById("weightHistory");
const goalInput = document.getElementById("goalInput");
const saveGoalBtn = document.getElementById("saveGoalBtn");
const goalStatus = document.getElementById("goalStatus");
const goalProgressBar = document.getElementById("goalProgressBar");
const goalProgressText = document.getElementById("goalProgressText");
const proInsightsBtn = document.getElementById("proInsightsBtn");

const onboardingTitle = document.getElementById("onboardingTitle");
const onboardingText = document.getElementById("onboardingText");
const onboardingNextBtn = document.getElementById("onboardingNextBtn");
const onboardingSkipBtn = document.getElementById("onboardingSkipBtn");
const onboardingDots = document.querySelectorAll(".dot");

const activateProBtn = document.getElementById("activateProBtn");
const continueFreeBtn = document.getElementById("continueFreeBtn");
const paywallStatus = document.getElementById("paywallStatus");

const MIN_WEIGHT = 1;
const MAX_WEIGHT = 500;
const LAST_WEIGHT_KEY = "scanfit:lastWeightKg";
const WEIGHT_HISTORY_KEY = "scanfit:weightHistoryKg";
const MAX_WEIGHT_HISTORY_ITEMS = 5;
const GOAL_DATA_KEY = "scanfit:goalData";
const ONBOARDING_DONE_KEY = "scanfit:onboardingDone";
const PRO_ACTIVE_KEY = "scanfit:proActive";

const onboardingSteps = [
  {
    title: "Bem-vindo ao Scan Fit IA",
    text: "Registre seu peso em segundos com câmera e OCR."
  },
  {
    title: "Acompanhe sua evolução",
    text: "Defina meta de peso e acompanhe seu progresso em tempo real."
  },
  {
    title: "Desbloqueie o Pro",
    text: "Tenha análise avançada e recursos premium para melhores resultados."
  }
];

let onboardingIndex = 0;

let stream = null;

function showScreen(id) {
  screens.forEach(screen => screen.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setLoading(isLoading) {
  loadingEl.classList.toggle("hidden", !isLoading);
}

function isProActive() {
  return localStorage.getItem(PRO_ACTIVE_KEY) === "true";
}

function setProActive(isActive) {
  localStorage.setItem(PRO_ACTIVE_KEY, String(isActive));
}

function setOnboardingDone(isDone) {
  localStorage.setItem(ONBOARDING_DONE_KEY, String(isDone));
}

function isOnboardingDone() {
  return localStorage.getItem(ONBOARDING_DONE_KEY) === "true";
}

function renderOnboardingStep() {
  const step = onboardingSteps[onboardingIndex];
  onboardingTitle.innerText = step.title;
  onboardingText.innerText = step.text;

  onboardingDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === onboardingIndex);
  });

  onboardingNextBtn.innerText = onboardingIndex === onboardingSteps.length - 1
    ? "Começar"
    : "Próximo";
}

function updateProUi() {
  if (isProActive()) {
    proInsightsBtn.innerText = "Análise avançada disponível";
    paywallStatus.innerText = "Pro ativo (modo mock).";
    return;
  }

  proInsightsBtn.innerText = "Análise avançada (Pro)";
  paywallStatus.innerText = "Assinatura simulada para validação do produto.";
}

function parseWeight(value) {
  const normalizedValue = String(value || "").replace(",", ".").trim();
  return Number(normalizedValue);
}

function validateWeight(weight) {
  if (!Number.isFinite(weight)) {
    return "Informe um peso válido.";
  }

  if (weight < MIN_WEIGHT || weight > MAX_WEIGHT) {
    return `O peso deve estar entre ${MIN_WEIGHT} e ${MAX_WEIGHT} kg.`;
  }

  return "";
}

function saveLastWeight(weight) {
  localStorage.setItem(LAST_WEIGHT_KEY, String(weight));
}

function saveGoalData(goalData) {
  localStorage.setItem(GOAL_DATA_KEY, JSON.stringify(goalData));
}

function loadGoalData() {
  const rawGoal = localStorage.getItem(GOAL_DATA_KEY);
  if (!rawGoal) {
    return null;
  }

  try {
    const parsedGoal = JSON.parse(rawGoal);
    const targetWeight = parseWeight(parsedGoal?.targetWeight);
    const startWeight = parseWeight(parsedGoal?.startWeight);

    if (!Number.isFinite(targetWeight) || !Number.isFinite(startWeight)) {
      return null;
    }

    return {
      targetWeight,
      startWeight
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

function loadWeightHistory() {
  const rawHistory = localStorage.getItem(WEIGHT_HISTORY_KEY);
  if (!rawHistory) {
    return [];
  }

  try {
    const parsedHistory = JSON.parse(rawHistory);
    if (!Array.isArray(parsedHistory)) {
      return [];
    }

    return parsedHistory
      .map(item => parseWeight(item))
      .filter(item => Number.isFinite(item));
  } catch (error) {
    console.error(error);
    return [];
  }
}

function saveWeightHistory(history) {
  localStorage.setItem(WEIGHT_HISTORY_KEY, JSON.stringify(history));
}

function renderWeightHistory(history) {
  if (!weightHistoryEl) {
    return;
  }

  if (!history.length) {
    weightHistoryEl.innerHTML = "<li>Sem histórico</li>";
    return;
  }

  const maxItems = isProActive() ? 30 : MAX_WEIGHT_HISTORY_ITEMS;
  const limitedHistory = history.slice(0, maxItems);

  const items = limitedHistory
    .map(item => `<li>${formatWeight(item)} kg</li>`)
    .join("");

  weightHistoryEl.innerHTML = items;
}

function addWeightToHistory(weight) {
  const currentHistory = loadWeightHistory();
  const maxItems = isProActive() ? 30 : MAX_WEIGHT_HISTORY_ITEMS;
  const newHistory = [
    weight,
    ...currentHistory.filter(item => item !== weight)
  ].slice(0, maxItems);

  saveWeightHistory(newHistory);
  renderWeightHistory(newHistory);
}

function updateGoalProgress(currentWeight) {
  const goalData = loadGoalData();

  if (!goalData) {
    goalStatus.innerText = "Defina uma meta para acompanhar seu progresso.";
    goalProgressText.innerText = "Sem progresso calculado ainda.";
    goalProgressBar.style.width = "0%";
    return;
  }

  const { startWeight, targetWeight } = goalData;
  const totalDistance = Math.abs(startWeight - targetWeight);
  const remainingDistance = Math.abs(currentWeight - targetWeight);

  let progressPercent = 0;
  if (totalDistance === 0) {
    progressPercent = currentWeight === targetWeight ? 100 : 0;
  } else {
    progressPercent = ((totalDistance - remainingDistance) / totalDistance) * 100;
  }

  const clampedProgress = Math.max(0, Math.min(100, progressPercent));
  goalProgressBar.style.width = `${clampedProgress.toFixed(0)}%`;

  if (remainingDistance === 0) {
    goalStatus.innerText = "Meta atingida. Excelente!";
  } else {
    goalStatus.innerText = `Meta: ${formatWeight(targetWeight)} kg · faltam ${formatWeight(remainingDistance)} kg`;
  }

  goalProgressText.innerText = `Progresso: ${clampedProgress.toFixed(0)}%`;
}

function loadLastWeight() {
  const storedWeight = localStorage.getItem(LAST_WEIGHT_KEY);
  if (!storedWeight) {
    return null;
  }

  const parsedWeight = parseWeight(storedWeight);
  if (!Number.isFinite(parsedWeight)) {
    return null;
  }

  return parsedWeight;
}

function formatWeight(weight) {
  return Number.isInteger(weight) ? String(weight) : weight.toFixed(1);
}

function applyWeightToResult(weight) {
  const formattedWeight = formatWeight(weight);
  weightEl.innerText = `${formattedWeight} kg`;
  weightInput.value = formattedWeight;
}

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    video.srcObject = stream;
  } catch (error) {
    alert("Erro ao acessar a câmera. Verifique as permissões do navegador.");
    console.error(error);
    showScreen("home");
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  video.srcObject = null;
}

async function readWeightFromImage(imageData) {
  ocrStatus.innerText = "Lendo peso...";

  try {
    const result = await Tesseract.recognize(imageData, "eng", {
      logger: message => console.log(message)
    });

    const text = result.data?.text || "";
    const numberMatch = text.match(/\d+/);

    if (numberMatch) {
      const detectedWeight = numberMatch[0];
      weightEl.innerText = `${detectedWeight} kg`;
      weightInput.value = detectedWeight;
      ocrStatus.innerText = "Peso identificado";
      return;
    }

    weightEl.innerText = "-- kg";
    weightInput.value = "";
    ocrStatus.innerText = "Não foi possível identificar";
  } catch (error) {
    weightEl.innerText = "-- kg";
    weightInput.value = "";
    ocrStatus.innerText = "Erro ao analisar imagem";
    console.error(error);
  }
}

scanBtn.addEventListener("click", async () => {
  showScreen("camera");
  await startCamera();
});

captureBtn.addEventListener("click", async () => {
  if (!video.videoWidth || !video.videoHeight) {
    alert("A câmera ainda não está pronta. Tente novamente em instantes.");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0);

  const imageData = canvas.toDataURL("image/png");
  photoPreview.src = imageData;

  stopCamera();
  showScreen("result");

  setLoading(true);
  await readWeightFromImage(imageData);
  setLoading(false);
});

confirmBtn.addEventListener("click", () => {
  const parsedWeight = parseWeight(weightInput.value);
  const validationError = validateWeight(parsedWeight);

  if (validationError) {
    alert(validationError);
    weightInput.focus();
    return;
  }

  applyWeightToResult(parsedWeight);
  saveLastWeight(parsedWeight);
  addWeightToHistory(parsedWeight);
  updateGoalProgress(parsedWeight);
  ocrStatus.innerText = `Último peso salvo: ${formatWeight(parsedWeight)} kg`;

  alert("Peso salvo com sucesso!");
  showScreen("home");
});

correctBtn.addEventListener("click", () => {
  weightInput.focus();
});

proInsightsBtn.addEventListener("click", () => {
  if (!isProActive()) {
    showScreen("paywall");
    return;
  }

  const parsedWeight = parseWeight(weightInput.value);
  if (!Number.isFinite(parsedWeight)) {
    alert("Registre um peso antes de abrir a análise avançada.");
    return;
  }

  const goalData = loadGoalData();
  if (!goalData) {
    alert("Defina uma meta para obter análise avançada.");
    return;
  }

  const delta = parsedWeight - goalData.targetWeight;
  const trend = delta > 0 ? "acima" : (delta < 0 ? "abaixo" : "na meta");
  const absDelta = Math.abs(delta);
  alert(`Análise Pro: você está ${absDelta.toFixed(1)} kg ${trend} da meta.`);
});

continueFreeBtn.addEventListener("click", () => {
  showScreen("result");
});

activateProBtn.addEventListener("click", () => {
  setProActive(true);
  updateProUi();
  renderWeightHistory(loadWeightHistory());
  alert("Pro ativado com sucesso (mock).");
  showScreen("result");
});

onboardingSkipBtn.addEventListener("click", () => {
  setOnboardingDone(true);
  showScreen("home");
});

onboardingNextBtn.addEventListener("click", () => {
  if (onboardingIndex < onboardingSteps.length - 1) {
    onboardingIndex += 1;
    renderOnboardingStep();
    return;
  }

  setOnboardingDone(true);
  showScreen("home");
});

saveGoalBtn.addEventListener("click", () => {
  const parsedGoalWeight = parseWeight(goalInput.value);
  const validationError = validateWeight(parsedGoalWeight);

  if (validationError) {
    alert(validationError);
    goalInput.focus();
    return;
  }

  const currentWeight = parseWeight(weightInput.value);
  const fallbackWeight = loadLastWeight();
  const startWeight = Number.isFinite(currentWeight)
    ? currentWeight
    : (fallbackWeight ?? parsedGoalWeight);

  saveGoalData({
    targetWeight: parsedGoalWeight,
    startWeight
  });

  updateGoalProgress(startWeight);
  alert("Meta salva com sucesso!");
});

const lastSavedWeight = loadLastWeight();
if (lastSavedWeight !== null) {
  applyWeightToResult(lastSavedWeight);
  ocrStatus.innerText = `Último peso salvo: ${formatWeight(lastSavedWeight)} kg`;
}

const weightHistory = loadWeightHistory();
renderWeightHistory(weightHistory);

const goalData = loadGoalData();
if (goalData) {
  goalInput.value = formatWeight(goalData.targetWeight);
}

const baselineWeight = lastSavedWeight ?? parseWeight(weightInput.value);
if (Number.isFinite(baselineWeight)) {
  updateGoalProgress(baselineWeight);
}

renderOnboardingStep();
updateProUi();

if (isOnboardingDone()) {
  showScreen("home");
} else {
  showScreen("onboarding");
}
