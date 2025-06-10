document.addEventListener('DOMContentLoaded', function() {
    const standingsBody = document.getElementById('standings-body');
    
    function loadStandings() {
        const teams = loadData('doubles-teams') || [];
        const matches = loadData('doubles-matches') || [];
        
        // Calculate standings
        const standings = calculateStandings(teams, matches);
        
        // Sort by points descending
        standings.sort((a, b) => b.points - a.points || b.wins - a.wins);
        
        // Display standings
        standingsBody.innerHTML = '';
        standings.forEach((team, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${team.name}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td>${team.gamesWon}</td>
                <td>${team.gamesLost}</td>
                <td><strong>${team.points}</strong></td>
            `;
            
            standingsBody.appendChild(row);
        });
    }
    
    function calculateStandings(teams, matches) {
        const standings = [];
        
        // Initialize standings for each team
        teams.forEach(team => {
            standings.push({
                id: team.id,
                name: team.name,
                wins: 0,
                losses: 0,
                gamesWon: 0,
                gamesLost: 0,
                points: 0
            });
        });
        
        // Process completed matches
        matches.forEach(match => {
            if (match.completed) {
                const team1 = standings.find(t => t.id === match.team1.id);
                const team2 = standings.find(t => t.id === match.team2.id);
                
                if (team1 && team2) {
                    // Update games won/lost
                    team1.gamesWon += match.team1.gamesWon;
                    team1.gamesLost += match.team1.gamesLost;
                    team2.gamesWon += match.team2.gamesWon;
                    team2.gamesLost += match.team2.gamesLost;
                    
                    // Update wins/losses and points
                    if (match.winner === team1.id) {
                        team1.wins += 1;
                        team1.points += 3;
                        team2.losses += 1;
                    } else {
                        team2.wins += 1;
                        team2.points += 3;
                        team1.losses += 1;
                    }
                }
            }
        });
        
        return standings;
    }
    
    loadStandings();
});