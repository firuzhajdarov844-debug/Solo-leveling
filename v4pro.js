// ===============================
// BODY SYSTEM v4 PRO ENGINE
// ===============================

let v4 = JSON.parse(localStorage.getItem("bodySystemV4")) || {
  profile: {
    name: "User",
    class: "Adaptive",
    aiMode: "Mentor" // Mentor | Coach | Strict | Silent
  },

  core: {
    level: 1,
    xp: 0,
    xpMax: 100,
    rank: "F"
  },

  stats: {
    power: 1,
    stamina: 1,
    control: 1,
    recovery: 1,
    focus: 1
  },

  systems: {
    fatigue: 0,
    stress: 0,
    recoveryMode: false
  },

  ai: {
    mood: "neutral",
    lastMessage: ""
  },

  history: []
};

const ranks = ["F","E","D","C","B","A","S","SS","SSS"];

// ===== SAVE / LOAD =====
function saveV4(){
  localStorage.setItem("bodySystemV4", JSON.stringify(v4));
}

// ===== AI SYSTEM =====
function aiMessage(text){
  v4.ai.lastMessage = text;
  const msg = document.createElement("div");
  msg.className = "system-msg";
  msg.innerText = "AI: " + text;
  document.body.appendChild(msg);
  setTimeout(()=>msg.remove(), 3500);
}

// ===== CORE ENGINE =====
function addXPv4(amount){
  v4.core.xp += amount;

  if(v4.core.xp >= v4.core.xpMax){
    v4.core.xp = 0;
    v4.core.level++;
    v4.core.xpMax = Math.floor(v4.core.xpMax * 1.35);

    rankCheckV4();
    levelEffect();

    aiAutoReaction("levelup");
  }

  saveV4();
  renderV4();
}

function rankCheckV4(){
  const index = Math.min(Math.floor(v4.core.level / 10), ranks.length-1);
  const newRank = ranks[index];

  if(v4.core.rank !== newRank){
    v4.core.rank = newRank;
    aiAutoReaction("rankup");
  }
}

// ===== TRAINING =====
function trainV4(type){
  if(v4.systems.fatigue >= 100){
    aiAutoReaction("overload");
    return;
  }

  v4.stats[type]++;
  v4.systems.fatigue += 12;
  addXPv4(30);

  v4.history.push({type, time: Date.now()});

  aiAutoReaction("train");
}

// ===== RECOVERY =====
function restV4(){
  v4.systems.fatigue = Math.max(0, v4.systems.fatigue - 40);
  v4.systems.stress = Math.max(0, v4.systems.stress - 20);
  aiAutoReaction("rest");
  saveV4();
  renderV4();
}

// ===== AI LOGIC =====
function aiAutoReaction(event){
  const mode = v4.profile.aiMode;

  const responses = {
    Mentor: {
      levelup: "Отличный прогресс. Продолжай развитие.",
      rankup: "Ты эволюционировал. Новый уровень сущности.",
      train: "Хорошая тренировка. Тело адаптируется.",
      rest: "Восстановление — часть роста.",
      overload: "Перегрузка. Отдых — приоритет."
    },
    Coach: {
      levelup: "Уровень повышен. Увеличиваем нагрузку.",
      rankup: "Ранг повышен. Переход на новый этап.",
      train: "Работай. Не останавливайся.",
      rest: "Короткий отдых и обратно в бой.",
      overload: "Стоп. Восстановление обязательно."
    },
    Strict: {
      levelup: "Слабый рост. Нужно больше усилий.",
      rankup: "Недостаточно. Следующий этап сложнее.",
      train: "Недостаточная нагрузка.",
      rest: "Минимальный отдых допустим.",
      overload: "Ты перегружен. Это ошибка."
    },
    Silent: {
      levelup: "",
      rankup: "",
      train: "",
      rest: "",
      overload: ""
    }
  };

  const text = responses[mode][event];
  if(text) aiMessage(text);
}

// ===== EFFECTS =====
function levelEffect(){
  const app = document.querySelector(".app");
  app.classList.add("level-up-flash");
  setTimeout(()=>app.classList.remove("level-up-flash"),1000);
}

// ===== UI =====
function renderV4(){
  document.getElementById("rank").innerText = v4.core.rank;
  document.getElementById("level").innerText = v4.core.level;
  document.getElementById("xp").innerText = v4.core.xp;
  document.getElementById("xpMax").innerText = v4.core.xpMax;

  document.getElementById("power").innerText = v4.stats.power;
  document.getElementById("stamina").innerText = v4.stats.stamina;
  document.getElementById("control").innerText = v4.stats.control;
  document.getElementById("fatigue").innerText = v4.systems.fatigue + "%";
}

renderV4();
