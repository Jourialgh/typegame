const STATUS = {
  IDLE: "idle",
  TYPING: "typing",
  FINISHED: "finished",
};

const gameState = {
  status: STATUS.IDLE,
  currentSnippet: null,
  startTime: null,
  endTime: null,
  totalKeystrokes: 0,
  correctKeystrokes: 0,
  prevLength: 0,
};

let timerInterval = null;

const snippetDisplay = document.getElementById("snippet-display");
const typingInput = document.getElementById("typing-input");
const languageBadge = document.getElementById("language-badge");
const timerEl = document.getElementById("timer");
const resultsEl = document.getElementById("results");
const statTime = document.getElementById("stat-time");
const statWpm = document.getElementById("stat-wpm");
const statAccuracy = document.getElementById("stat-accuracy");
const restartBtn = document.getElementById("restart-btn");
const newSnippetBtn = document.getElementById("new-snippet-btn");

function escapeHtml(char) {
  if (char === "&") return "&amp;";
  if (char === "<") return "&lt;";
  if (char === ">") return "&gt;";
  return char;
}

function renderDiff(target, typed) {
  let html = "";
  for (let i = 0; i < target.length; i++) {
    const char = escapeHtml(target[i]);
    let className = "pending";
    if (i < typed.length) {
      className = typed[i] === target[i] ? "correct" : "incorrect";
    } else if (i === typed.length) {
      className = "current";
    }
    html += `<span class="${className}">${char}</span>`;
  }
  snippetDisplay.innerHTML = html;
}

function pickRandomSnippet(excludeId) {
  const candidates = SNIPPETS.filter((s) => s.id !== excludeId);
  const pool = candidates.length ? candidates : SNIPPETS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function loadSnippet(snippet) {
  gameState.status = STATUS.IDLE;
  gameState.currentSnippet = snippet;
  gameState.startTime = null;
  gameState.endTime = null;
  gameState.totalKeystrokes = 0;
  gameState.correctKeystrokes = 0;
  gameState.prevLength = 0;

  stopTimer();
  timerEl.textContent = "0.0s";

  languageBadge.textContent = snippet.language;
  typingInput.value = "";
  typingInput.maxLength = snippet.code.length;
  typingInput.disabled = false;
  resultsEl.classList.add("hidden");

  renderDiff(snippet.code, "");
  typingInput.focus();
}

function startTimer() {
  gameState.startTime = performance.now();
  timerInterval = setInterval(() => {
    const elapsed = (performance.now() - gameState.startTime) / 1000;
    timerEl.textContent = `${elapsed.toFixed(1)}s`;
  }, 50);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function computeStats() {
  const timeSeconds = (gameState.endTime - gameState.startTime) / 1000;
  const target = gameState.currentSnippet.code;
  const wpm = (target.length / 5) / (timeSeconds / 60);
  const accuracy =
    gameState.totalKeystrokes === 0
      ? 100
      : (gameState.correctKeystrokes / gameState.totalKeystrokes) * 100;

  return {
    timeSeconds,
    wpm,
    accuracy,
  };
}

function finishGame() {
  gameState.status = STATUS.FINISHED;
  gameState.endTime = performance.now();
  stopTimer();

  const finalElapsed = (gameState.endTime - gameState.startTime) / 1000;
  timerEl.textContent = `${finalElapsed.toFixed(1)}s`;

  typingInput.disabled = true;

  const { timeSeconds, wpm, accuracy } = computeStats();
  statTime.textContent = `${timeSeconds.toFixed(1)}s`;
  statWpm.textContent = `${Math.round(wpm)}`;
  statAccuracy.textContent = `${Math.round(accuracy)}%`;
  resultsEl.classList.remove("hidden");
}

function handleInput() {
  const target = gameState.currentSnippet.code;
  const typed = typingInput.value;

  if (gameState.status === STATUS.IDLE) {
    gameState.status = STATUS.TYPING;
    startTimer();
  }

  if (typed.length > gameState.prevLength) {
    for (let i = gameState.prevLength; i < typed.length; i++) {
      gameState.totalKeystrokes++;
      if (typed[i] === target[i]) {
        gameState.correctKeystrokes++;
      }
    }
  }
  gameState.prevLength = typed.length;

  renderDiff(target, typed);

  if (typed.length === target.length && typed === target) {
    finishGame();
  }
}

function handleKeydown(event) {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = typingInput.selectionStart;
    const end = typingInput.selectionEnd;
    const value = typingInput.value;
    typingInput.value = value.slice(0, start) + "  " + value.slice(end);
    typingInput.selectionStart = typingInput.selectionEnd = start + 2;
    handleInput();
  }
}

typingInput.addEventListener("input", handleInput);
typingInput.addEventListener("keydown", handleKeydown);

restartBtn.addEventListener("click", () => {
  loadSnippet(gameState.currentSnippet);
});

newSnippetBtn.addEventListener("click", () => {
  const next = pickRandomSnippet(gameState.currentSnippet?.id);
  loadSnippet(next);
});

loadSnippet(pickRandomSnippet());
