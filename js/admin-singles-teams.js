document.addEventListener('DOMContentLoaded', function() {
    const playerNameInput = document.getElementById('player-name');
    const addPlayerBtn = document.getElementById('add-player');
    const generateMatchesBtn = document.getElementById('generate-matches');
    const resetTeamsBtn = document.getElementById('reset-teams');
    const playersList = document.getElementById('players-list');
    
    let players = loadData('singles-teams') || [];
    
    // Render players list
    function renderPlayersList() {
        playersList.innerHTML = '';
        
        if (players.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3" class="text-center">Aucun joueur enregistré</td>`;
            playersList.appendChild(row);
            return;
        }
        
        players.forEach((player, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-player" data-id="${player.id}">Supprimer</button>
                </td>
            `;
            
            playersList.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-player').forEach(btn => {
            btn.addEventListener('click', function() {
                const playerId = this.getAttribute('data-id');
                deletePlayer(playerId);
            });
        });
    }
    
    // Add a new player
    function addPlayer() {
        const name = playerNameInput.value.trim();
        
        if (name === '') {
            alert('Veuillez entrer un nom de joueur');
            return;
        }
        
        const newPlayer = {
            id: generateId(),
            name: name
        };
        
        players.push(newPlayer);
        saveData('singles-teams', players);
        playerNameInput.value = '';
        renderPlayersList();
    }
    
    // Delete a player
    function deletePlayer(playerId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) {
            players = players.filter(player => player.id !== playerId);
            saveData('singles-teams', players);
            renderPlayersList();
        }
    }
    
    // Generate matches (round-robin tournament)
    function generateMatches() {
        if (players.length < 2) {
            alert('Il faut au moins 2 joueurs pour générer des matchs');
            return;
        }
        
        const matches = [];
        
        // Create all possible unique pairings
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                matches.push({
                    id: generateId(),
                    team1: { id: players[i].id, gamesWon: 0, gamesLost: 0 },
                    team2: { id: players[j].id, gamesWon: 0, gamesLost: 0 },
                    completed: false,
                    winner: null,
                    date: null,
                    time: null
                });
            }
        }
        
        saveData('singles-matches', matches);
        alert(`${matches.length} matchs ont été générés !`);
    }
    
    // Reset all teams
    function resetTeams() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les joueurs ? Cette action supprimera également tous les matchs.')) {
            players = [];
            saveData('singles-teams', players);
            clearData('singles-matches');
            renderPlayersList();
        }
    }
    
    // Event listeners
    addPlayerBtn.addEventListener('click', addPlayer);
    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addPlayer();
    });
    
    generateMatchesBtn.addEventListener('click', generateMatches);
    resetTeamsBtn.addEventListener('click', resetTeams);
    
    // Initial render
    renderPlayersList();
});