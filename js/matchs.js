const matchs = JSON.parse(localStorage.getItem("matchs") || "[]");
const container = document.getElementById("matchs");

matchs.forEach((m, i) => {
  container.innerHTML += `
    <div class="card">
      <span>${m.equipeA} vs ${m.equipeB}</span>
      <div>
        <input type="number" id="a-${i}" value="${m.scoreA}" placeholder="0">
        <span>–</span>
        <input type="number" id="b-${i}" value="${m.scoreB}" placeholder="0">
      </div>
    </div>
  `;
});

function save() {
  matchs.forEach((m, i) => {
    m.scoreA = document.getElementById(`a-${i}`).value;
    m.scoreB = document.getElementById(`b-${i}`).value;
  });
  localStorage.setItem("matchs", JSON.stringify(matchs));
  alert("Résultats enregistrés !");
}
