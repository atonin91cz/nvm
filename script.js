// Konfigurace
const config = {
  sceneWidth: 1920,
  sceneHeight: 1080,
  ballSize: 120,
  speed: 3,
  twitchChannel: "ton1ceq",
};

// Stavy míčku
const states = {
  IDLE: "idle",
  WALKING: "walking",
  TALKING: "talking",
  DANCING: "dancing",
  JUMPING: "jumping",
};

// Globální proměnné
let currentState = states.IDLE;
let currentPosition = { x: 200, y: config.sceneHeight - 220 };
let targetPosition = null;
let isFacingRight = true;
let autoMode = true;
let lastActionTime = Date.now();

// DOM elementy
const ball = document.getElementById("ball");
const ballModel = document.getElementById("ball-model");
const speechBubble = document.getElementById("speech-bubble");
const bubbleText = document.getElementById("bubble-text");
const jumpEffect = document.getElementById("jump-effect");
const danceEffect = document.getElementById("dance-effect");
const colorBall = document.getElementById("color-ball");
const customText = document.getElementById("custom-text");
const autoModeCheckbox = document.getElementById("auto-mode");

// Věty míčku
const phrases = {
  greetings: [
    "Čau {user}! Vítej v chatu!",
    "Ahoj {user}, rád tě vidím!",
    "Nazdar {user}, jak se máš?",
    "{user} se připojil! To je super!",
    "Hej {user}, připoj se k zábavě!",
  ],
  random: [
    "Ton1ceq je nejlepší streamer!",
    "Kdo chce shoutout? Napiš !shoutout",
    "Dneska je den na super zábavu!",
    "Mám rád žlutou barvu, a ty?",
    "Koukám, že dneska máme skvělou komunitu!",
    "Napište do chatu, co bych měl dělat!",
    "Umím skákat! Teda... skoro umím!",
    "Kdo mi pošle follow, dostane virtuální odraz!",
  ],
  commands: {
    hello: "Ahoj {user}! Jak se máš?",
    dance: "Juchůůů! Tanec je můj život!",
    jump: "HOP! {user} mi dal energii na skok!",
    walk: "Jdu na procházku, kdo se přidá?",
  },
};

// Inicializace
function init() {
  // Nastavení event listenerů
  setupEventListeners();

  // Spuštění herní smyčky
  gameLoop();

  // Nastavení výchozí pozice
  updateBallPosition();
}

// Nastavení event listenerů
function setupEventListeners() {
  // Ovládání barev
  colorBall.addEventListener("input", () => {
    ballModel.style.backgroundColor = colorBall.value;
  });

  // Automatický režim
  autoModeCheckbox.addEventListener("change", (e) => {
    autoMode = e.target.checked;
  });

  // Klávesové zkratky
  document.addEventListener("keydown", (e) => {
    if (e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case "w":
          ballCommand("walk");
          break;
        case "t":
          ballCommand("talk");
          break;
        case "d":
          ballCommand("dance");
          break;
        case "j":
          ballCommand("jump");
          break;
        case "r":
          ballCommand("reset");
          break;
      }
    }
  });
}

// Hlavní herní smyčka
function gameLoop() {
  if (autoMode && currentState === states.IDLE) {
    const idleTime = (Date.now() - lastActionTime) / 1000;

    // Po 20 vteřinách nečinnosti udělá náhodnou akci
    if (idleTime > 20) {
      setRandomAction();
    }
  }

  if (currentState === states.WALKING && targetPosition) {
    moveToTarget();
  }

  requestAnimationFrame(gameLoop);
}

// Pohybové funkce
function moveToTarget() {
  const dx = targetPosition.x - currentPosition.x;
  const dy = targetPosition.y - currentPosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < config.speed) {
    currentPosition = { ...targetPosition };
    targetPosition = null;
    if (currentState === states.WALKING) {
      setState(states.IDLE);
    }
    return;
  }

  // Otočení míčku
  if (dx > 0 && !isFacingRight) {
    isFacingRight = true;
    ballModel.style.transform = "scaleX(1)";
  } else if (dx < 0 && isFacingRight) {
    isFacingRight = false;
    ballModel.style.transform = "scaleX(-1)";
  }

  // Pohyb
  currentPosition.x += (dx / distance) * config.speed;
  currentPosition.y += (dy / distance) * config.speed;

  updateBallPosition();
}

function updateBallPosition() {
  ball.style.left = `${currentPosition.x}px`;
  ball.style.bottom = `${config.sceneHeight - currentPosition.y}px`;

  // Aktualizace bubliny
  if (speechBubble.classList.contains("show")) {
    speechBubble.style.left = `${currentPosition.x + 50}px`;
    speechBubble.style.bottom = `${
      config.sceneHeight - currentPosition.y + 120
    }px`;
  }
}

// Akce míčku
function startWalking() {
  setState(states.WALKING);

  targetPosition = {
    x: Math.random() * (config.sceneWidth - config.ballSize),
    y: Math.random() * (config.sceneHeight - 300) + 100,
  };

  say(phrases.commands.walk);
}

function startTalking() {
  const randomPhrase =
    phrases.random[Math.floor(Math.random() * phrases.random.length)];
  say(randomPhrase);
}

function startDancing() {
  setState(states.DANCING);
  danceEffect.classList.remove("d-none");
  danceEffect.style.left = `${currentPosition.x - 90}px`;
  danceEffect.style.bottom = `${config.sceneHeight - currentPosition.y - 90}px`;

  setTimeout(() => {
    danceEffect.classList.add("d-none");
    setState(states.IDLE);
  }, 5000);

  say(phrases.commands.dance);
}

function jump() {
  setState(states.JUMPING);
  jumpEffect.classList.remove("d-none");
  jumpEffect.style.left = `${currentPosition.x - 15}px`;
  jumpEffect.style.bottom = `${config.sceneHeight - currentPosition.y - 15}px`;

  setTimeout(() => {
    jumpEffect.classList.add("d-none");
    setState(states.IDLE);
  }, 1000);

  say("Hop!");
}

function say(text) {
  setState(states.TALKING);
  bubbleText.textContent = text;
  speechBubble.classList.add("show");

  setTimeout(() => {
    speechBubble.classList.remove("show");
    if (currentState === states.TALKING) {
      setState(states.IDLE);
    }
  }, 3000);
}

function setState(newState) {
  ball.className = "";
  currentState = newState;

  switch (newState) {
    case states.WALKING:
      ball.classList.add("walking");
      break;
    case states.DANCING:
      ball.classList.add("dancing");
      break;
    case states.JUMPING:
      ball.classList.add("jumping");
      break;
    case states.TALKING:
      ball.classList.add("talking");
      break;
  }
}

function setRandomAction() {
  const actions = [
    { action: startWalking, weight: 4 },
    { action: startTalking, weight: 3 },
    { action: startDancing, weight: 1 },
    { action: jump, weight: 2 },
  ];

  const totalWeight = actions.reduce((sum, a) => sum + a.weight, 0);
  let random = Math.random() * totalWeight;
  let action;

  for (const a of actions) {
    if (random < a.weight) {
      action = a.action;
      break;
    }
    random -= a.weight;
  }

  if (action) action();
}

function resetPosition() {
  currentPosition = { x: 200, y: config.sceneHeight - 220 };
  targetPosition = null;
  updateBallPosition();
  setState(states.IDLE);
  say("Jsem zpět!");
}

// Globální funkce pro HTML
window.ballCommand = function (cmd) {
  lastActionTime = Date.now();
  switch (cmd) {
    case "walk":
      startWalking();
      break;
    case "talk":
      const text = document.getElementById("custom-text").value;
      if (text) say(text);
      else startTalking();
      break;
    case "dance":
      startDancing();
      break;
    case "jump":
      jump();
      break;
    case "reset":
      resetPosition();
      break;
  }
};

window.togglePanel = function () {
  document.querySelector(".control-panel").classList.toggle("panel-collapsed");
};

// Spuštění aplikace
document.addEventListener("DOMContentLoaded", init);
