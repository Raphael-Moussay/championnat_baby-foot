document.addEventListener('DOMContentLoaded', function() {
    const playerNameInput = document.getElementById('player-name');
    const addPlayerBtn = document.getElementById('add-player');
    const generateMatchesBtn = document.getElementById('generate-matches');
    const resetTeamsBtn = document.getElementById('reset-teams');
    const playersList = document.getElementById('players-list');
    
    let players = [];

    async function fetchPlayers() {
        const { data, error } = await supabase.from('singles_teams').select('*').order('id', { ascending: true });
        if (error) {
            alert("Erreur lors du chargement des joueurs : " + error.message);
            return;
        }
        players = data || [];
        renderPlayersList();
    }

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
        document.querySelectorAll('.delete-player').forEach(btn => {
            btn.addEventListener('click', function() {
                const playerId = this.getAttribute('data-id');
                deletePlayer(playerId);
            });
        });
    }

    async function addPlayer() {
        const name = playerNameInput.value.trim();
        if (name === '') {
            alert('Veuillez entrer un nom de joueur');
            return;
        }
        const { error } = await supabase.from('singles_teams').insert([{ name }]);
        if (error) {
            alert("Erreur lors de l'ajout : " + error.message);
            return;
        }
        playerNameInput.value = '';
        fetchPlayers();
    }

    async function deletePlayer(playerId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) {
            const { error } = await supabase.from('singles_teams').delete().eq('id', playerId);
            if (error) {
                alert("Erreur lors de la suppression : " + error.message);
                return;
            }
            fetchPlayers();
        }
    }

    // Nouvelle version : ne génère que les nouveaux matchs non existants
    async function generateMatches() {
        if (players.length < 2) {
            alert('Il faut au moins 2 joueurs pour générer des matchs');
            return;
        }
        // Récupère tous les matchs existants
        const { data: existingMatches, error: matchError } = await supabase
            .from('singles_matches')
            .select('team1_id, team2_id');
        if (matchError) {
            alert("Erreur lors de la récupération des matchs existants : " + matchError.message);
            return;
        }
        // On stocke les paires existantes dans un Set pour vérification rapide
        const matchSet = new Set();
        (existingMatches || []).forEach(m => {
            // On stocke les paires triées pour ignorer l'ordre
            const key = [Math.min(m.team1_id, m.team2_id), Math.max(m.team1_id, m.team2_id)].join('-');
            matchSet.add(key);
        });

        const newMatches = [];
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                const key = [Math.min(players[i].id, players[j].id), Math.max(players[i].id, players[j].id)].join('-');
                if (!matchSet.has(key)) {
                    newMatches.push({
                        team1_id: players[i].id,
                        team2_id: players[j].id,
                        games_won1: 0,
                        games_won2: 0,
                        completed: false,
                        winner: null
                    });
                }
            }
        }
        if (newMatches.length === 0) {
            alert("Aucun nouveau match à générer !");
            return;
        }
        const { error } = await supabase.from('singles_matches').insert(newMatches);
        if (error) {
            alert("Erreur lors de la génération : " + error.message);
            return;
        }
        alert(`${newMatches.length} nouveaux matchs ont été générés !`);
    }

    async function resetTeams() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les joueurs ? Cette action supprimera également tous les matchs.')) {
            await supabase.from('singles_teams').delete().neq('id', 0);
            await supabase.from('singles_matches').delete().neq('id', 0);
            fetchPlayers();
        }
    }

    addPlayerBtn.addEventListener('click', addPlayer);
    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addPlayer();
    });
    generateMatchesBtn.addEventListener('click', generateMatches);
    resetTeamsBtn.addEventListener('click', resetTeams);

    fetchPlayers();
});