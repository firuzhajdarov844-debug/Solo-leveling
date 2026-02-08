// ===============================
// BODY SYSTEM V3 — HYBRID MODE
// ===============================

let system = JSON.parse(localStorage.getItem("bodySystemV3")) || {
  level: 1,
  xp: 0,
  xpMax: 100,
  rank: "F",
  stats: {
    power: 1,
    stamina: 1,
    control: 1
  },
  fatigue: 0,
  missions: [],
  achievements: [],
  lastTraining: null
};

const ranks = ["F","E","D","C","B","A","S","SS","SSS"];

function saveSystem() {
  localStorage.setItem("bodySystemV3", JSON.stringify(system));
}

function systemMessage(text) {
  const msg = document.createElement("div");
  msg.className = "system-msg";
  msg.innerText = text;
  document.body.appendChild(msg);
  setTimeout(()=>msg.remove(), 3000);
}

function addXP(amount){
  system.xp += amount;
  if(system.xp >= system.xpMax){
    system.xp = 0;
    system.level++;
    system.xpMax += 50;
    rankCheck();
    systemMessage("LEVEL UP! Уровень " + system.level);
  }
  saveSystem();
}

function rankCheck(){
  const index = Math.min(Math.floor(system.level / 5), ranks.length-1);
  const newRank = ranks[index];

  if(system.rank !== newRank){
    system.rank = newRank;

    const app = document.querySelector(".app");
    app.classList.add("level-up-flash");

    setTimeout(()=>app.classList.remove("level-up-flash"),1000);

    applyRankAura();
    systemMessage("RANK UP! Новый ранг: " + newRank);
  }
}

function train(stat){
  if(system.fatigue >= 100){
    systemMessage("SYSTEM: Перегрузка. Нужен отдых.");
    return;
  }

  system.stats[stat]++;
  system.fatigue += 10;
  addXP(25);

  systemMessage("Тренировка: " + stat.toUpperCase());
  saveSystem();
  renderV3();
}

function rest(){
  system.fatigue = Math.max(0, system.fatigue - 30);
  systemMessage("Восстановление...");
  saveSystem();
  renderV3();
}

function dailyMission(){
  const missions = [
    "20 отжиманий",
    "30 приседаний",
    "1 минута планки",
    "10 бурпи",
    "растяжка 5 минут"
  ];
  const m = missions[Math.floor(Math.random()*missions.length)];
  systemMessage("Миссия дня: " + m);
}

function renderV3(){
  document.getElementById("rank").innerText = system.rank;
  document.getElementById("level").innerText = system.level;
  document.getElementById("power").innerText = system.stats.power;
  document.getElementById("stamina").innerText = system.stats.stamina;
  document.getElementById("control").innerText = system.stats.control;
  document.getElementById("xp").innerText = system.xp;
  document.getElementById("xpMax").innerText = system.xpMax;
}

renderV3();
