let player = {
  level: 1,
  xp: 0,
  xpToLevel: 100,
  rank: "F",
  stats: {
    strength: 1,
    stamina: 1,
    control: 1
  }
};

const ranks = ["F","E","D","C","B","A","S","SS","SSS"];

function saveGame(){
  localStorage.setItem("bodySystem", JSON.stringify(player));
}

function loadGame(){
  const data = localStorage.getItem("bodySystem");
  if(data){
    player = JSON.parse(data);
  }
}

function addXP(amount){
  player.xp += amount;
  if(player.xp >= player.xpToLevel){
    levelUp();
  }
  updateUI();
  saveGame();
}

function levelUp(){
  player.xp = 0;
  player.level++;
  player.xpToLevel = Math.floor(player.xpToLevel * 1.3);

  if(player.level % 5 === 0){
    rankUp();
  }
}

function rankUp(){
  let index = ranks.indexOf(player.rank);
  if(index < ranks.length - 1){
    player.rank = ranks[index + 1];
    // бонус ранга
    player.stats.strength += 2;
    player.stats.stamina += 2;
    player.stats.control += 2;
  }
}

function train(type){
  if(type === "strength"){
    player.stats.strength++;
    addXP(20);
  }
  if(type === "stamina"){
    player.stats.stamina++;
    addXP(20);
  }
  if(type === "control"){
    player.stats.control++;
    addXP(20);
  }
}

function updateUI(){
  document.getElementById("rank").innerText = player.rank;
  document.getElementById("level").innerText = player.level;
  document.getElementById("xp").innerText = player.xp + " / " + player.xpToLevel;

  document.getElementById("strength").innerText = player.stats.strength;
  document.getElementById("stamina").innerText = player.stats.stamina;
  document.getElementById("control").innerText = player.stats.control;
}

window.onload = () => {
  loadGame();
  updateUI();
};
