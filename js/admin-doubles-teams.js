document.addEventListener('DOMContentLoaded', function() {
    const teamNameInput = document.getElementById('team-name');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const addTeamBtn = document.getElementById('add-team');
    const generateMatchesBtn = document.getElementById('generate-doubles-matches');
    const resetTeamsBtn = document.getElementById('reset-doubles-teams');
    const teamsList = document.getElementById('teams-list');
    
    let doublesTeams = loadData('doubles-teams') || [];
    
    // Render teams list
    function renderTeamsList() {
        teamsList.innerHTML = '';
        
        if (doublesTeams.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" class="text-center">Aucune équipe enregistrée</td>`;
            teamsList.appendChild(row);
            return;
        }
        
        doublesTeams.forEach((team, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${team.name}</td>
                <td>${team.player1} & ${team.player2}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-team" data-id="${team.id}">Supprimer</button>
                </td>
            `;
            teamsList.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-team').forEach(btn => {
            btn.addEventListener('click', function() {
                const teamId = this.getAttribute('data-id');
                deleteTeam(teamId);
            });
        });
    }
    
    // Add a new team
    function addTeam() {
        const name = teamNameInput.value.trim();
        const player1 = player1Input.value.trim();
        const player2 = player2Input.value.trim();
        
        if (name === '') {
            alert('Veuillez entrer un nom d\'équipe');
            return;
        }
        
        if (player1 === '' || player2 === '') {
            alert('Veuillez entrer le nom des deux joueurs');
            return;
        }
        
        if (player1.toLowerCase() === player2.toLowerCase()) {
            alert('Les deux joueurs doivent être différents');
            return;
        }
        
        const newTeam = {
            id: generateId(),
            name: name,
            player1: player1,
            player2: player2
        };
        
        doublesTeams.push(newTeam);
        saveData('doubles-teams', doublesTeams);
        
        teamNameInput.value = '';
        player1Input.value = '';
        player2Input.value = '';
        
        renderTeamsList();
    }
    
    // Delete a team
    function deleteTeam(teamId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
            doublesTeams = doublesTeams.filter(team => team.id !== teamId);
            saveData('doubles-teams', doublesTeams);
            renderTeamsList();
        }
    }
    
    // Generate matches (round-robin tournament)
    function generateMatches() {
        if (doublesTeams.length < 2) {
            alert('Il faut au moins 2 équipes pour générer des matchs');
            return;
        }
        
        const matches = [];
        
        // Create all possible unique pairings
        for (let i = 0; i < doublesTeams.length; i++) {
            for (let j = i + 1; j < doublesTeams.length; j++) {
                matches.push({
                    id: generateId(),
                    team1: { id: doublesTeams[i].id, gamesWon: 0, gamesLost: 0 },
                    team2: { id: doublesTeams[j].id, gamesWon: 0, gamesLost: 0 },
                    completed: false,
                    winner: null,
                    date: null,
                    time: null
                });
            }
        }
        
        saveData('doubles-matches', matches);
        alert(`${matches.length} matchs ont été générés !`);
    }
    
    // Reset all teams
    function resetTeams() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les équipes ? Cette action supprimera également tous les matchs.')) {
            doublesTeams = [];
            saveData('doubles-teams', doublesTeams);
            clearData('doubles-matches');
            renderTeamsList();
        }
    }
    
    // Event listeners
    addTeamBtn.addEventListener('click', addTeam);
    generateMatchesBtn.addEventListener('click', generateMatches);
    resetTeamsBtn.addEventListener('click', resetTeams);
    
    // Initial render
    renderTeamsList();
});