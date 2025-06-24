document.addEventListener('DOMContentLoaded', function() {
    const teamNameInput = document.getElementById('team-name');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const addTeamBtn = document.getElementById('add-team');
    const generateMatchesBtn = document.getElementById('generate-doubles-matches');
    const resetTeamsBtn = document.getElementById('reset-doubles-teams');
    const teamsList = document.getElementById('teams-list');
    
    let doublesTeams = [];

    async function fetchTeams() {
        const { data, error } = await supabase.from('doubles_teams').select('*').order('id', { ascending: true });
        if (error) {
            alert("Erreur lors du chargement des équipes : " + error.message);
            return;
        }
        doublesTeams = data || [];
        renderTeamsList();
    }
    
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
        document.querySelectorAll('.delete-team').forEach(btn => {
            btn.addEventListener('click', function() {
                const teamId = this.getAttribute('data-id');
                deleteTeam(teamId);
            });
        });
    }
    
    async function addTeam() {
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

        const { error } = await supabase.from('doubles_teams').insert([{ name, player1, player2 }]);
        if (error) {
            alert("Erreur lors de l'ajout : " + error.message);
            return;
        }

        teamNameInput.value = '';
        player1Input.value = '';
        player2Input.value = '';
        fetchTeams();
    }
    
    async function deleteTeam(teamId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
            const { error } = await supabase.from('doubles_teams').delete().eq('id', teamId);
            if (error) {
                alert("Erreur lors de la suppression : " + error.message);
                return;
            }
            fetchTeams();
        }
    }
    
    // Génère uniquement les nouveaux matchs non existants
    async function generateMatches() {
        if (doublesTeams.length < 2) {
            alert('Il faut au moins 2 équipes pour générer des matchs');
            return;
        }
        // Récupère tous les matchs existants
        const { data: existingMatches, error: matchError } = await supabase
            .from('doubles_matches')
            .select('team1_id, team2_id');
        if (matchError) {
            alert("Erreur lors de la récupération des matchs existants : " + matchError.message);
            return;
        }
        // Stocke les paires existantes dans un Set pour vérification rapide
        const matchSet = new Set();
        (existingMatches || []).forEach(m => {
            const key = [Math.min(m.team1_id, m.team2_id), Math.max(m.team1_id, m.team2_id)].join('-');
            matchSet.add(key);
        });

        const newMatches = [];
        for (let i = 0; i < doublesTeams.length; i++) {
            for (let j = i + 1; j < doublesTeams.length; j++) {
                const key = [Math.min(doublesTeams[i].id, doublesTeams[j].id), Math.max(doublesTeams[i].id, doublesTeams[j].id)].join('-');
                if (!matchSet.has(key)) {
                    newMatches.push({
                        team1_id: doublesTeams[i].id,
                        team2_id: doublesTeams[j].id,
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
        const { error } = await supabase.from('doubles_matches').insert(newMatches);
        if (error) {
            alert("Erreur lors de la génération : " + error.message);
            return;
        }
        alert(`${newMatches.length} nouveaux matchs ont été générés !`);
    }
    
    async function resetTeams() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les équipes ? Cette action supprimera également tous les matchs.')) {
            await supabase.from('doubles_teams').delete().neq('id', 0);
            await supabase.from('doubles_matches').delete().neq('id', 0);
            fetchTeams();
        }
    }
    
    addTeamBtn.addEventListener('click', addTeam);
    generateMatchesBtn.addEventListener('click', generateMatches);
    resetTeamsBtn.addEventListener('click', resetTeams);
    
    fetchTeams();
});