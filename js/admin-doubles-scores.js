document.addEventListener('DOMContentLoaded', function() {
    const matchesToScore = document.getElementById('matches-to-score');
    const scoredMatches = document.getElementById('scored-matches');
    
    let matches = loadData('doubles-matches') || [];
    const teams = loadData('doubles-teams') || [];
    
    // Render matches to score
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
            const team1 = teams.find(t => t.id === match.team1.id);
            const team2 = teams.find(t => t.id === match.team2.id);
            
            if (team1 && team2) {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${team1.name} vs ${team2.name}</td>
                    <td>
                        <button class="btn btn-primary enter-score" data-id="${match.id}">Entrer le score</button>
                    </td>
                `;
                
                matchesToScore.appendChild(row);
            }
        });
        
        // Add event listeners to enter score buttons
        document.querySelectorAll('.enter-score').forEach(btn => {
            btn.addEventListener('click', function() {
                const matchId = this.getAttribute('data-id');
                showScoreModal(matchId);
            });
        });
    }
    
    // Render scored matches
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
            const team1 = teams.find(t => t.id === match.team1.id);
            const team2 = teams.find(t => t.id === match.team2.id);
            const winner = teams.find(t => t.id === match.winner);
            
            if (team1 && team2 && winner) {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${team1.name} vs ${team2.name}</td>
                    <td>${match.team1.gamesWon}-${match.team2.gamesWon}</td>
                    <td>${winner.name}</td>
                `;
                
                scoredMatches.appendChild(row);
            }
        });
    }
    
    // Show modal for entering scores
    function showScoreModal(matchId) {
        const match = matches.find(m => m.id === matchId);
        if (!match) return;
        
        const team1 = teams.find(t => t.id === match.team1.id);
        const team2 = teams.find(t => t.id === match.team2.id);
        
        if (!team1 || !team2) return;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'score-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Entrer le score: ${team1.name} vs ${team2.name}</h3>
                
                <div class="manches-container">
                    <h4>Manches</h4>
                    <div class="manche-input">
                        <label>Manche 1:</label>
                        <input type="number" class="score-input team1-manche1" min="0" max="8" value="0">
                        <span class="score-separator">-</span>
                        <input type="number" class="score-input team2-manche1" min="0" max="8" value="0">
                    </div>
                    <div class="manche-input">
                        <label>Manche 2:</label>
                        <input type="number" class="score-input team1-manche2" min="0" max="8" value="0">
                        <span class="score-separator">-</span>
                        <input type="number" class="score-input team2-manche2" min="0" max="8" value="0">
                    </div>
                    <div class="manche-input">
                        <label>Manche 3:</label>
                        <input type="number" class="score-input team1-manche3" min="0" max="8" value="0">
                        <span class="score-separator">-</span>
                        <input type="number" class="score-input team2-manche3" min="0" max="8" value="0">
                    </div>
                    <div class="manche-input">
                        <label>Manche 4:</label>
                        <input type="number" class="score-input team1-manche4" min="0" max="8" value="0">
                        <span class="score-separator">-</span>
                        <input type="number" class="score-input team2-manche4" min="0" max="8" value="0">
                    </div>
                    <div class="manche-input">
                        <label>Manche 5:</label>
                        <input type="number" class="score-input team1-manche5" min="0" max="8" value="0">
                        <span class="score-separator">-</span>
                        <input type="number" class="score-input team2-manche5" min="0" max="8" value="0">
                    </div>
                </div>
                
                <div class="form-group">
                    <button class="btn btn-primary" id="save-score">Enregistrer</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        });
        
        // Save score
        modal.querySelector('#save-score').addEventListener('click', function() {
            saveMatchScore(matchId, modal);
        });
    }
    
    // Save match score
    function saveMatchScore(matchId, modal) {
        const match = matches.find(m => m.id === matchId);
        if (!match) return;
        
        // Get scores for each manche
        const manches = [];
        let team1Wins = 0;
        let team2Wins = 0;
        
        for (let i = 1; i <= 5; i++) {
            const team1Score = parseInt(modal.querySelector(`.team1-manche${i}`).value) || 0;
            const team2Score = parseInt(modal.querySelector(`.team2-manche${i}`).value) || 0;
            
            // Only count manches that were actually played (non-zero scores)
            if (team1Score > 0 || team2Score > 0) {
                if (team1Score > team2Score) team1Wins++;
                if (team2Score > team1Score) team2Wins++;
                
                manches.push({
                    team1: team1Score,
                    team2: team2Score
                });
            }
        }
        
        // Validate scores
        if (manches.length === 0) {
            alert('Veuillez entrer au moins une manche valide');
            return;
        }
        
        // Check if match is complete (one team has 3 wins)
        if (team1Wins < 3 && team2Wins < 3) {
            alert('Le match n\'est pas terminé (aucune équipe n\'a 3 manches gagnantes)');
            return;
        }
        
        // Check for valid 5th manche if needed
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
        
        // Update match
        match.team1.gamesWon = team1Wins;
        match.team1.gamesLost = team2Wins;
        match.team2.gamesWon = team2Wins;
        match.team2.gamesLost = team1Wins;
        match.completed = true;
        match.winner = team1Wins > team2Wins ? match.team1.id : match.team2.id;
        
        // Save
        saveData('doubles-matches', matches);
        
        // Close modal and refresh
        modal.style.display = 'none';
        document.body.removeChild(modal);
        renderMatchesToScore();
        renderScoredMatches();
    }
    
    // Initial render
    renderMatchesToScore();
    renderScoredMatches();
});