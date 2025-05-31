let equipes = JSON.parse(localStorage.getItem("equipes") || "[]");
const input = document.getElementById("newEquipe");
const ul = document.getElementById("listeEquipes");

function refresh() {
  ul.innerHTML = "";
  equipes.forEach(e => ul.innerHTML += `<li>${e}</li>`);
}

function addEquipe() {
  const nom = input.value.trim();
  if (nom && !equipes.includes(nom)) {
    equipes.push(nom);
    input.value = "";
    localStorage.setItem("equipes", JSON.stringify(equipes));
    refresh();
  }
}

function genererMatchs() {
  const matchs = [];
  for (let i = 0; i < equipes.length; i++) {
    for (let j = i + 1; j < equipes.length; j++) {
      matchs.push({
        equipeA: equipes[i],
        equipeB: equipes[j],
        scoreA: "",
        scoreB: ""
      });
    }
  }
  localStorage.setItem("matchs", JSON.stringify(matchs));
  alert("Matchs générés !");
}

refresh();
