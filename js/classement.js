const equipes = JSON.parse(localStorage.getItem("equipes") || "[]");
const matchs = JSON.parse(localStorage.getItem("matchs") || "[]");

const stats = equipes.map(nom => ({
  nom,
  pts: 0,
  mj: 0,
  v: 0,
  d: 0,
}));

matchs.forEach(m => {
  if (m.scoreA !== "" && m.scoreB !== "") {
    const scoreA = parseInt(m.scoreA), scoreB = parseInt(m.scoreB);
    const eqA = stats.find(e => e.nom === m.equipeA);
    const eqB = stats.find(e => e.nom === m.equipeB);
    eqA.mj++; eqB.mj++;
    if (scoreA > scoreB) {
      eqA.pts += 3; eqA.v++; eqB.d++;
    } else if (scoreB > scoreA) {
      eqB.pts += 3; eqB.v++; eqA.d++;
    } else {
      eqA.pts += 1; eqB.pts += 1;
    }
  }
});

stats.sort((a, b) => b.pts - a.pts);
const tbody = document.getElementById("classement");
stats.forEach((equipe, i) => {
  tbody.innerHTML += `
    <tr>
      <td>${i + 1}</td>
      <td>${equipe.nom}</td>
      <td>${equipe.pts}</td>
      <td>${equipe.mj}</td>
      <td>${equipe.v}</td>
      <td>${equipe.d}</td>
    </tr>
  `;
});
