document.addEventListener('DOMContentLoaded', function() {
    const matchesToScore = document.getElementById('matches-to-score');
    const scoredMatches = document.getElementById('scored-matches');

    let matches = [];
    let teams = [];

    // Récupère les données depuis Supabase
    async function fetchData() {
        const { data: m } = await supabase.from('doubles_matches').select('*');
        const { data: t } = await supabase.from('doubles_teams').select('*');
        matches = m || [];
        teams = t || [];
        renderMatchesToScore();
        renderScoredMatches();
    }

    // Affiche les matchs à saisir
    function renderMatchesToScore() {
        matchesToScore.innerHTML = '';
        const incompleteMatches = matches.filter(match => !match.completed);

        if (incompleteMatches.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3" class="text-center">Aucun match à saisir</td>`;
            matchesToScore.appendChild(row);
            return;
        }

        incompleteMatches.forEach(match => {
            const team1 = teams.find(t => t.id === match.team1_id);
            const team2 = teams.find(t => t.id === match.team2_id);

            if (team1 && team2) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${team1.name}</strong> (${team1.player1} & ${team1.player2}) vs <strong>${team2.name}</strong> (${team2.player1} & ${team2.player2})</td>
                    <td>
                        <button class="btn btn-primary enter-score" data-id="${match.id}">Entrer le score</button>
                    </td>
                `;
                matchesToScore.appendChild(row);
            }
        });

        document.querySelectorAll('.enter-score').forEach(btn => {
            btn.addEventListener('click', function() {
                const matchId = this.getAttribute('data-id');
                showScoreModal(matchId);
            });
        });
    }

    // Affiche les matchs terminés
    function renderScoredMatches() {
        scoredMatches.innerHTML = '';
        const completedMatches = matches.filter(match => match.completed);

        if (completedMatches.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3" class="text-center">Aucun match terminé</td>`;
            scoredMatches.appendChild(row);
            return;
        }

        completedMatches.forEach(match => {
            const team1 = teams.find(t => t.id === match.team1_id);
            const team2 = teams.find(t => t.id === match.team2_id);
            const winner = teams.find(t => t.id === match.winner);

            if (team1 && team2 && winner) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${team1.name}</strong> (${team1.player1} & ${team1.player2}) vs <strong>${team2.name}</strong> (${team2.player1} & ${team2.player2})</td>
                    <td>${match.games_won1}-${match.games_won2}</td>
                    <td><strong>${winner.name}</strong></td>
                `;
                scoredMatches.appendChild(row);
            }
        });
    }

    // Affiche la modale de saisie de score
    function showScoreModal(matchId) {
        const match = matches.find(m => m.id == matchId);
        if (!match) return;

        const team1 = teams.find(t => t.id === match.team1_id);
        const team2 = teams.find(t => t.id === match.team2_id);
        if (!team1 || !team2) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'score-modal';

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Entrer le score: ${team1.name} (${team1.player1} & ${team1.player2}) vs ${team2.name} (${team2.player1} & ${team2.player2})</h3>
                <div class="manches-container">
                    <h4>Manches</h4>
                    ${[1,2,3,4,5].map(i => `
                        <div class="manche-input">
                            <label>Manche ${i}:</label>
                            <input type="number" class="score-input team1-manche${i}" min="0" max="8" value="0">
                            <span class="score-separator">-</span>
                            <input type="number" class="score-input team2-manche${i}" min="0" max="8" value="0">
                        </div>
                    `).join('')}
                </div>
                <div class="form-group">
                    <button class="btn btn-primary" id="save-score">Enregistrer</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';

        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        });

        modal.querySelector('#save-score').addEventListener('click', function() {
            saveMatchScore(matchId, modal);
        });
    }

    // Sauvegarde le score dans Supabase
    async function saveMatchScore(matchId, modal) {
        const match = matches.find(m => m.id == matchId);
        if (!match) return;

        let team1Wins = 0;
        let team2Wins = 0;
        const manches = [];

        for (let i = 1; i <= 5; i++) {
            const team1Score = parseInt(modal.querySelector(`.team1-manche${i}`).value) || 0;
            const team2Score = parseInt(modal.querySelector(`.team2-manche${i}`).value) || 0;
            if (team1Score > 0 || team2Score > 0) {
                if (team1Score > team2Score) team1Wins++;
                if (team2Score > team1Score) team2Wins++;
                manches.push({ team1: team1Score, team2: team2Score });
            }
        }

        if (manches.length === 0) {
            alert('Veuillez entrer au moins une manche valide');
            return;
        }
        if (team1Wins < 3 && team2Wins < 3) {
            alert('Le match n\'est pas terminé (aucune équipe n\'a 3 manches gagnantes)');
            return;
        }
        if (manches.length === 5) {
            const lastManche = manches[4];
            if (lastManche.team1 === 5 && lastManche.team2 === 5) {
                alert('En 5ème manche, un écart de 2 points est nécessaire (5-5 n\'est pas un score valide)');
                return;
            }
            if (lastManche.team1 > 8 || lastManche.team2 > 8) {
                alert('En 5ème manche, le score maximum est de 8 points');
                return;
            }
        }

        const winnerId = team1Wins > team2Wins ? match.team1_id : match.team2_id;
        const { error } = await supabase.from('doubles_matches')
            .update({
                games_won1: team1Wins,
                games_won2: team2Wins,
                completed: true,
                winner: winnerId
            })
            .eq('id', matchId);
        if (error) {
            alert("Erreur lors de l'enregistrement : " + error.message);
            return;
        }

        modal.style.display = 'none';
        document.body.removeChild(modal);
        fetchData();
    }

    // Initial fetch
    fetchData();
});