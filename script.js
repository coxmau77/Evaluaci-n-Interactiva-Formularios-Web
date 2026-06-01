// --- 1. Base de Datos de Preguntas ---
const quizData = [
  {
    question:
      "¿Cuál es el propósito principal de las etiquetas <fieldset> y <legend>?",
    options: [
      "Dar diseño estético sin CSS.",
      "Agrupar lógicamente campos para mejorar la accesibilidad.",
      "Crear paginación en el formulario.",
    ],
    correct: 1,
    explanation:
      "<strong>Agrupar lógicamente campos</strong> es correcto. <code>&lt;fieldset&gt;</code> agrupa campos relacionados y <code>&lt;legend&gt;</code> les da un título descriptivo, mejorando la accesibilidad para lectores de pantalla. El diseño visual se maneja con CSS, no con <code>&lt;fieldset&gt;</code>.",
  },
  {
    question:
      "El atributo type='email' requiere JavaScript para verificar el símbolo '@'.",
    options: ["Verdadero", "Falso"],
    correct: 1,
    explanation:
      "Es <strong>Falso</strong>. El navegador valida automáticamente el formato de email sin necesidad de JavaScript. Si el valor no contiene '@' y un dominio válido, el navegador muestra un mensaje de error nativo al intentar enviar el formulario.",
  },
  {
    question:
      "¿Qué ventaja ofrece usar <input type='number'> en un teléfono móvil?",
    options: [
      "Despliega automáticamente el teclado numérico.",
      "Aumenta el tamaño de la fuente.",
      "Impide que la pantalla se apague.",
    ],
    correct: 0,
    explanation:
      "La opción correcta es que <strong>despliega el teclado numérico</strong> en dispositivos móviles, facilitando la escritura de números. No aumenta la fuente ni evita que la pantalla se apague.",
  },
  {
    question:
      "La etiqueta <datalist> obliga al usuario a elegir solo las opciones predefinidas.",
    options: ["Verdadero", "Falso"],
    correct: 1,
    explanation:
      "Es <strong>Falso</strong>. <code>&lt;datalist&gt;</code> solo <em>sugiere</em> opciones, pero el usuario puede escribir cualquier valor. Para restringir a opciones fijas se usa <code>&lt;select&gt;</code>.",
  },
  {
    question:
      "¿Qué atributo sugiere información guardada previamente para llenar rápido el formulario?",
    options: ["autofill", "suggest", "autocomplete"],
    correct: 2,
    explanation:
      "El atributo correcto es <strong>autocomplete</strong>. Cuando está activo, el navegador sugiere valores previamente ingresados por el usuario. <code>autofill</code> no existe como atributo HTML estándar.",
  },
  {
    question:
      "Para ocultar contraseñas ingresadas, se utiliza el atributo type='secret'.",
    options: ["Verdadero", "Falso"],
    correct: 1,
    explanation:
      "Es <strong>Falso</strong>. El atributo correcto es <code>type='password'</code>, no <code>'secret'</code>. <code>type='password'</code> oculta los caracteres mientras se escriben.",
  },
  {
    question:
      "La etiqueta <legend> debe ser el primer hijo directo del <fieldset>.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    explanation:
      "Es <strong>Verdadero</strong>. Por especificación HTML, <code>&lt;legend&gt;</code> debe ser el primer elemento hijo de <code>&lt;fieldset&gt;</code> para que los lectores de pantalla lo asocien correctamente con el grupo de campos.",
  },
  {
    question: "¿Cómo se vincula correctamente un <input> con un <datalist>?",
    options: [
      "Anidando el input dentro del datalist.",
      "El atributo 'list' del input debe coincidir con el 'id' del datalist.",
      "Usando el atributo 'name' en ambos.",
    ],
    correct: 1,
    explanation:
      "La forma correcta es que el <strong>atributo <code>list</code> del <code>&lt;input&gt;</code> coincida con el <code>id</code> del <code>&lt;datalist&gt;</code></strong>. No se anida uno dentro del otro ni se usa el atributo <code>name</code> para vincularlos.",
  },
  {
    question:
      "Si el input tiene min='18' y se ingresa 15, ¿qué hace el navegador al enviar?",
    options: [
      "Envía y marca en rojo.",
      "Detiene el envío y muestra una advertencia nativa.",
      "El servidor rechaza los datos.",
    ],
    correct: 1,
    explanation:
      "El navegador <strong>detiene el envío y muestra una advertencia nativa</strong> gracias a la validación HTML5. Esto ocurre antes de que los datos lleguen al servidor. No envía datos inválidos a menos que se use el atributo <code>novalidate</code>.",
  },
  {
    question:
      "La validación HTML5 hace innecesaria la validación en el servidor (Node.js).",
    options: ["Verdadero", "Falso"],
    correct: 1,
    explanation:
      "Es <strong>Falso</strong>. La validación HTML5 es solo del lado del cliente y puede ser evadida fácilmente. Siempre se debe validar también en el servidor (Node.js, PHP, etc.) por seguridad, ya que la validación del cliente es solo para mejorar la experiencia de usuario.",
  },
];

// --- 2. Variables de Estado ---
let currentQuestionIndex = 0;
let score = 0;
let startTime;
let timerInterval;
let elapsedSeconds = 0;

// --- 3. Referencias al DOM ---
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const questionCounter = document.getElementById("question-counter");
const timerDisplay = document.getElementById("timer-display");
const themeToggle = document.getElementById("theme-toggle");
const recordsBody = document.getElementById("records-body");
const nextBtn = document.getElementById("next-btn");

// --- 4. Funcionalidad Dark Mode ---
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️ Light";
  }
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.body.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙 Dark";
  } else {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️ Light";
  }
});

// --- 5. Funciones auxiliares ---
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- 6. Lógica del Quiz y Timer ---
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTimer() {
  elapsedSeconds++;
  timerDisplay.textContent = `⏱️ ${formatTime(elapsedSeconds)}`;
}

document.getElementById("start-btn").addEventListener("click", () => {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  timerDisplay.classList.remove("hidden");

  currentQuestionIndex = 0;
  score = 0;
  elapsedSeconds = 0;
  timerDisplay.textContent = `⏱️ 00:00`;

  shuffleArray(quizData);

  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  loadQuestion();
});

function loadQuestion() {
  const feedbackContainer = document.getElementById("feedback-container");
  feedbackContainer.classList.add("hidden");
  feedbackContainer.className = "hidden";
  nextBtn.classList.add("hidden");

  const currentData = quizData[currentQuestionIndex];
  questionCounter.textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizData.length}`;
  questionText.textContent = currentData.question;
  optionsContainer.innerHTML = "";

  const correctAnswer = currentData.options[currentData.correct];
  const shuffledOptions = shuffleArray([...currentData.options]);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);

  shuffledOptions.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option-btn");
    button.addEventListener("click", () => selectAnswer(index, correctIndex));
    optionsContainer.appendChild(button);
  });
}

function selectAnswer(selectedIndex, correctIndex) {
  const currentData = quizData[currentQuestionIndex];
  const buttons = optionsContainer.querySelectorAll(".option-btn");

  buttons.forEach((btn) => (btn.disabled = true));

  const selectedButton = buttons[selectedIndex];
  const feedbackContainer = document.getElementById("feedback-container");
  const feedbackText = document.getElementById("feedback-text");

  if (selectedIndex === correctIndex) {
    selectedButton.classList.add("correct");
    feedbackContainer.className = "feedback-correct";
    feedbackText.innerHTML = `✅ Correcto. ${currentData.explanation}`;
    score++;

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  } else {
    selectedButton.classList.add("incorrect");
    buttons[correctIndex].classList.add("correct");
    feedbackContainer.className = "feedback-incorrect";
    feedbackText.innerHTML = `❌ Incorrecto. ${currentData.explanation}`;
  }

  feedbackContainer.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
}

function endQuiz() {
  clearInterval(timerInterval);
  quizScreen.classList.add("hidden");
  timerDisplay.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  document.getElementById("final-score").textContent = score;
  document.getElementById("final-time").textContent = formatTime(elapsedSeconds);

  saveRecord(score, elapsedSeconds);
  renderRecords();
}

// --- 6. Persistencia de Datos con LocalStorage ---
function saveRecord(finalScore, finalTime) {
  const date = new Date().toLocaleDateString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const newRecord = { date, score: finalScore, time: finalTime };

  const savedRecords = JSON.parse(localStorage.getItem("quizRecords")) || [];
  savedRecords.push(newRecord);

  localStorage.setItem("quizRecords", JSON.stringify(savedRecords));
}

function renderRecords() {
  const savedRecords = JSON.parse(localStorage.getItem("quizRecords")) || [];
  recordsBody.innerHTML = "";

  if (savedRecords.length === 0) {
    recordsBody.innerHTML =
      '<tr><td colspan="3" style="text-align:center;">No hay récords aún</td></tr>';
    return;
  }

  savedRecords.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });

  savedRecords.slice(0, 5).forEach((record) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${record.date}</td><td>${record.score}/10</td><td>${formatTime(record.time)}</td>`;
    recordsBody.appendChild(tr);
  });
}

document.getElementById("restart-btn").addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    endQuiz();
  }
});

// Inicialización
initTheme();
renderRecords();
