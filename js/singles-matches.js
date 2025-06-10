document.addEventListener('DOMContentLoaded', function() {
    const matchesBody = document.getElementById('matches-body');
    
    function loadAllMatches() {
        const matches = loadData('singles-matches') || [];
        const teams = loadData('singles-teams') || [];
        
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
                    <td>${team1.name} vs ${team2.name}</td>
                    <td>${result}</td>
                `;
                matchesBody.appendChild(row);
            }
        });
    }
    
    loadAllMatches();
});