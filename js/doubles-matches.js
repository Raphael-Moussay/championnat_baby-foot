document.addEventListener('DOMContentLoaded', function() {
    const matchesBody = document.getElementById('matches-body');
    
    function loadAllMatches() {
        const matches = loadData('doubles-matches') || [];
        const teams = loadData('doubles-teams') || [];
        
        matchesBody.innerHTML = '';
        
        if (matches.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="2" class="text-center">Aucun match programmé pour le moment</td>`;
            matchesBody.appendChild(row);
            return;
        }
        
        matches.forEach(match => {
            const team1 = teams.find(t => t.id === match.team1.id);
            const team2 = teams.find(t => t.id === match.team2.id);
            
            if (team1 && team2) {
                let result = "À jouer";
                if (match.completed) {
                    result = `${match.team1.gamesWon} - ${match.team2.gamesWon}`;
                }
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <strong>${team1.name}</strong> (${team1.player1} & ${team1.player2})<br>
                        vs<br>
                        <strong>${team2.name}</strong> (${team2.player1} & ${team2.player2})
                    </td>
                    <td>${result}</td>
                `;
                matchesBody.appendChild(row);
            }
        });
    }
    
    loadAllMatches();
});