const ball = document.getElementById("ball");
const ballModel = document.getElementById("ball-model");
const speechBubble = document.getElementById("speech-bubble");
const bubbleText = document.getElementById("bubble-text");
const tongue = document.querySelector(".tongue");
const bubble = document.querySelector(".bubble");
const bubbleStains = document.getElementById("bubble-stains");
const controlButtons = document.querySelectorAll(".control-btn");
const chatInput = document.getElementById("chat-input");
const sendChatBtn = document.getElementById("send-chat");
const autoModeCheckbox = document.getElementById("auto-mode");
const controlPanel = document.getElementById("control-panel");
const monitorCrack = document.getElementById("monitor-crack");
const colorPicker = document.getElementById("color-picker");

// Configuration
const config = {
  moveInterval: 300000,
  actionInterval: 10000,
  screenWidth: 1920,
  screenHeight: 1080,
  ballSize: 140,
  idleTime: 30000,
  blinkInterval: 5000,
};

// Activity tracking
let lastActivityTime = Date.now();
let idleTimer;
let blinkTimer;
let moveInterval;
let actionInterval;
let isAutoMode = true;
let isTalking = false;
let isBlowing = false;
let talkInterval;
let blowInterval;
let currentTalkAnimation = null;

// All available actions
const miniActions = [
  {
    name: "wink",
    duration: 600,
    class: "wink",
    description: "Mrkne jedním okem",
  },
  {
    name: "jump",
    duration: 800,
    class: "jumping",
    description: "Vyskočí do vzduchu",
  },
  {
    name: "happy",
    duration: 3000,
    class: "happy",
    description: "Usměje se a vyplázne jazyk",
  },
  {
    name: "lol",
    duration: 7000,
    class: "lol",
    description: "Směje se až k slzám",
  },
  {
    name: "surprised",
    duration: 3000,
    class: "surprised",
    description: "Udělá překvapený výraz",
  },
  {
    name: "rotate",
    duration: 2000,
    class: "rotate",
    description: "Zatočí se dokola",
  },
  {
    name: "wave",
    duration: 8000,
    class: "wave",
    description: "Zamává divákům",
  },
  {
    name: "tap",
    duration: 8000,
    class: "tap",
    description: "Ťukne na obrazovku",
  },
  {
    name: "vibrate",
    duration: 1000,
    class: "vibrate",
    description: "Rozvibruje se",
  },
  {
    name: "bubble-gum",
    duration: 2000,
    class: "bubble-gum",
    description: "Fouká žvýkačkovou bublinu",
  },
  {
    name: "blink",
    duration: 400,
    class: "blink",
    description: "Mrkne oběma očima",
  },
  {
    name: "talk",
    duration: 1000,
    messages: [
      "Ahoj chat! 👋",
      "Jak se máte? 😊",
      "To je hra! 🎾",
      "Dneska to rozjedeme! 🚀",
      "Ton1ceq je nejlepší! ⚡",
      "Kdo mi pošle follow? ❤️",
      "Kdo mi pošle Donate? ❤️",
      "Nečum mišáku :D ? ",
      
      "Co podniknem? ❤",
       "Kdo mi pošle follow? ❤️",
      "Už vás začínám srát co?? ❤️",
      "Pěkný stream! 📺",
      "Haha, to je legrace! 😄",
      "LUL 😂",
      "PogChamp 🤩",
      "Kappa 🎭",
      "MonkaS 😱",
      "Ťuk ťuk! 👊",
      "Foukáám! 💨",
      "BUM! 💥",
    ],
    description: "Promluví k divákům",
  },
  {
    name: "show-butt",
    duration: 3000,
    class: "show-butt",
    description: "Ukáže nahý zadek",
  },
];

// Initialize
function init() {
  setupAutoMode(true);
  setupDraggablePanel();
  setupColorPicker();
  setTimeout(showCapabilities, 3000);
}

function setupAutoMode(enabled) {
  isAutoMode = enabled;

  if (moveInterval) clearInterval(moveInterval);
  if (actionInterval) clearInterval(actionInterval);
  if (blinkTimer) clearInterval(blinkTimer);
  if (idleTimer) clearInterval(idleTimer);

  if (enabled) {
    moveToRandomPosition();
    moveInterval = setInterval(moveToRandomPosition, config.moveInterval);
    actionInterval = setInterval(performMiniAction, config.actionInterval);
    blinkTimer = setInterval(
      randomEyeAction,
      config.blinkInterval + Math.random() * 5000
    );
    idleTimer = setInterval(checkIdle, 1000);
  }

  controlButtons.forEach((btn) => {
    if (btn.dataset.action) {
      btn.disabled = enabled;
    }
  });
}

function setupColorPicker() {
  colorPicker.addEventListener("input", (e) => {
    const color = e.target.value;
    const darkerColor = shadeColor(color, -20);
    document.documentElement.style.setProperty(
      "--ball-color",
      `radial-gradient(circle at 30% 30%, ${color}, ${darkerColor})`
    );

    // Update hands and butt color
    document.querySelectorAll(".hand, .butt").forEach((el) => {
      el.style.background = `radial-gradient(ellipse at center, ${color} 0%, ${darkerColor} 100%)`;
    });
  });
}

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  const RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

function moveToRandomPosition() {
  const maxX = config.screenWidth - config.ballSize;
  const maxY = config.screenHeight - config.ballSize;
  ball.style.left = `${Math.floor(Math.random() * maxX)}px`;
  ball.style.bottom = `${Math.floor(Math.random() * maxY)}px`;
  updateBubblePosition();
}

function performMiniAction() {
  if (!isAutoMode) return;
  resetAllActions();
  const action = miniActions[Math.floor(Math.random() * miniActions.length)];
  triggerAction(action);
}

function triggerAction(action) {
  resetAllActions();
  lastActivityTime = Date.now();

  if (action.name === "tap" || action.name === "wave") {
    const useLeft = Math.random() > 0.5;
    ballModel.classList.toggle("left-hand-active", useLeft);
    ballModel.classList.toggle("right-hand-active", !useLeft);
  }

  ballModel.classList.add(action.class);

  if (action.name === "talk") {
    const message = action.messages
      ? action.messages[Math.floor(Math.random() * action.messages.length)]
      : "Ahoj chat!";
    startTalking(message);
  }

  if (action.name === "bubble-gum") {
    startBlowing();
  }

  if (action.name === "tap") {
    createMonitorCrack();
  }

  setTimeout(() => {
    resetAllActions();
  }, action.duration);
}

function createMonitorCrack() {
  monitorCrack.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const crack = document.createElement("div");
    crack.className = "crack-line";
    const startX = Math.random() * config.screenWidth;
    const startY = Math.random() * config.screenHeight;
    const length = 100 + Math.random() * 300;
    const angle = Math.random() * Math.PI * 2;
    crack.style.width = `${length}px`;
    crack.style.height = "2px";
    crack.style.left = `${startX}px`;
    crack.style.top = `${startY}px`;
    crack.style.transform = `rotate(${angle}rad)`;
    monitorCrack.appendChild(crack);
  }
  monitorCrack.classList.add("show");
  setTimeout(() => monitorCrack.classList.remove("show"), 2000);
}

function animateTalking() {
  if (!isTalking) return;

  const message = bubbleText.textContent.toLowerCase();
  const vowels = [
    "a",
    "á",
    "e",
    "é",
    "ě",
    "i",
    "í",
    "o",
    "ó",
    "u",
    "ú",
    "ů",
    "y",
    "ý",
  ];
  const words = message.split(" ");
  let currentWordIndex = 0;
  let currentSyllableIndex = 0;

  if (currentTalkAnimation) {
    clearTimeout(currentTalkAnimation);
  }

  function animateNext() {
    if (!isTalking) return;

    ballModel.classList.remove(
      "talking-1",
      "talking-2",
      "talking-3",
      "talking"
    );

    if (currentWordIndex >= words.length) {
      ballModel.classList.add("talking-2", "talking");
      return;
    }

    const word = words[currentWordIndex];
    const syllables = word.split(/([aeiouyáéěíóúůý])/).filter(Boolean);

    if (currentSyllableIndex >= syllables.length) {
      ballModel.classList.add("talking-1", "talking");
      currentWordIndex++;
      currentSyllableIndex = 0;
      currentTalkAnimation = setTimeout(animateNext, 150);
      return;
    }

    const syllable = syllables[currentSyllableIndex];
    const isVowel = vowels.some((v) => syllable.includes(v));

    const state = isVowel ? "talking-2" : "talking-3";
    ballModel.classList.add(state, "talking");

    currentSyllableIndex++;

    const speed = isVowel ? 200 : 100;
    currentTalkAnimation = setTimeout(animateNext, speed);
  }

  animateNext();
}

function startTalking(message) {
  isTalking = true;
  bubbleText.textContent = message;
  updateBubblePosition();
  speechBubble.classList.add("show");

  if (currentTalkAnimation) {
    clearTimeout(currentTalkAnimation);
  }

  animateTalking();

  const duration = Math.max(2000, message.length * 100);
  setTimeout(() => {
    stopTalking();
  }, duration);
}

function stopTalking() {
  isTalking = false;
  speechBubble.classList.remove("show");

  ballModel.classList.remove("talking-1", "talking-2", "talking-3", "talking");
  ballModel.classList.add("talking-1");

  setTimeout(() => {
    ballModel.classList.remove("talking-1");
  }, 300);
}

function animateBlowing() {
  if (!isBlowing) return;

  const blowing = Math.random() > 0.3;
  if (blowing) {
    ballModel.classList.add("blowing");
  } else {
    ballModel.classList.remove("blowing");
  }

  blowInterval = setTimeout(animateBlowing, 200 + Math.random() * 300);
}

function startBlowing() {
  isBlowing = true;
  bubble.style.width = "0";
  bubble.style.height = "0";
  bubble.style.opacity = "1";
  bubbleStains.innerHTML = "";

  setTimeout(() => {
    animateBlowing();
    let size = 5;
    const growInterval = setInterval(() => {
      size += 1.5;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.opacity = "0.95";
      bubble.style.top = `${70 - size / 15}px`;

      if (size > 80) {
        clearInterval(growInterval);
        setTimeout(() => {
          bubble.style.opacity = "0";
          stopBlowing();
          createStains();
        }, 500);
      }
    }, 40);
  }, 10);
}

function stopBlowing() {
  isBlowing = false;
  clearTimeout(blowInterval);
  ballModel.classList.remove("blowing");
}

function createStains() {
  for (let i = 0; i < 6; i++) {
    const stain = document.createElement("div");
    stain.className = "bubble-stain";
    stain.style.width = `${6 + Math.random() * 12}px`;
    stain.style.height = stain.style.width;
    stain.style.left = `${40 + Math.random() * 80}px`;
    stain.style.top = `${40 + Math.random() * 80}px`;
    bubbleStains.appendChild(stain);

    setTimeout(() => {
      stain.style.opacity = "0.9";
      setTimeout(() => {
        stain.style.opacity = "0";
        setTimeout(() => stain.remove(), 1000);
      }, 2000);
    }, i * 150);
  }
}

function randomEyeAction() {
  if (!isAutoMode) return;
  const blinkBoth = Math.random() > 0.3;
  ballModel.classList.add(blinkBoth ? "blink" : "wink");
  setTimeout(() => ballModel.classList.remove("blink", "wink"), 400);
}

function checkIdle() {
  if (!isAutoMode) return;

  const now = Date.now();
  if (now - lastActivityTime > config.idleTime) {
    triggerAction(miniActions.find((a) => a.name === "blink"));
    setTimeout(() => {
      triggerAction(miniActions.find((a) => a.name === "blink"));
    }, 300);
  }
}

function updateBubblePosition() {
  const ballRect = ball.getBoundingClientRect();
  speechBubble.style.left = `${ballRect.right + 10}px`;
  speechBubble.style.top = `${ballRect.top + 60}px`;
}

function resetAllActions() {
  ballModel.className = "";
  speechBubble.classList.remove("show");
  bubble.style.width = "0";
  bubble.style.height = "0";
  isTalking = false;
  isBlowing = false;
  clearTimeout(talkInterval);
  clearTimeout(blowInterval);
  if (currentTalkAnimation) {
    clearTimeout(currentTalkAnimation);
    currentTalkAnimation = null;
  }
}

function showCapabilities() {
  let message = "Umím: ";
  miniActions.forEach((action, index) => {
    message += action.description;
    if (index < miniActions.length - 1) message += ", ";
  });

  bubbleText.textContent = message;
  updateBubblePosition();
  speechBubble.classList.add("show");
  setTimeout(() => speechBubble.classList.remove("show"), 5000);
}

function setupDraggablePanel() {
  let isDragging = false;
  let offsetX, offsetY;

  controlPanel.addEventListener("mousedown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
    isDragging = true;
    offsetX = e.clientX - controlPanel.getBoundingClientRect().left;
    offsetY = e.clientY - controlPanel.getBoundingClientRect().top;
    controlPanel.style.opacity = "0.8";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    controlPanel.style.left = `${e.clientX - offsetX}px`;
    controlPanel.style.top = `${e.clientY - offsetY}px`;
    controlPanel.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    controlPanel.style.opacity = "1";
  });
}

function setupControlPanel() {
  controlButtons.forEach((btn) => {
    if (btn.dataset.action) {
      btn.addEventListener("click", () => {
        if (isAutoMode) return;
        const action = miniActions.find((a) => a.name === btn.dataset.action);
        if (action) triggerAction(action);
      });
    }
  });

  sendChatBtn.addEventListener("click", sendChatMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendChatMessage();
  });

  autoModeCheckbox.addEventListener("change", (e) => {
    setupAutoMode(e.target.checked);
  });
}

function sendChatMessage() {
  const message = chatInput.value.trim();
  if (message) {
    startTalking(message);
    chatInput.value = "";
  }
}

window.addEventListener("load", () => {
  init();
  setupControlPanel();
});
