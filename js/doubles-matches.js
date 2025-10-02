document.addEventListener('DOMContentLoaded', function() {
    const matchesBody = document.getElementById('matches-body');
    const teamFilter = document.getElementById('team-filter');
    let allMatches = [];
    let teams = [];
    let currentFilter = 'all';

    async function loadAllMatches() {
        const { data: matches } = await supabase.from('doubles_matches').select('*');
        const { data: t } = await supabase.from('doubles_teams').select('*');
        allMatches = matches || [];
        teams = t || [];

        // populate filter
        if (teamFilter) {
            teamFilter.innerHTML = '<option value="all">Toutes les équipes</option>';
            teams.forEach(team => {
                const opt = document.createElement('option');
                opt.value = team.id;
                opt.textContent = team.name;
                teamFilter.appendChild(opt);
            });
            teamFilter.addEventListener('change', () => {
                currentFilter = teamFilter.value;
                renderMatches();
            });
        }

        renderMatches();
    }

    function renderMatches() {
        matchesBody.innerHTML = '';
        const matches = allMatches.filter(m => {
            if (currentFilter === 'all') return true;
            return m.team1_id == currentFilter || m.team2_id == currentFilter;
        });
        if (!matches || matches.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="2" class="text-center">Aucun match programmé pour le moment</td>`;
            matchesBody.appendChild(row);
            return;
        }
        matches.forEach(match => {
            const team1 = teams.find(t => t.id === match.team1_id);
            const team2 = teams.find(t => t.id === match.team2_id);
            if (!team1 || !team2) return;
            let result = "À jouer";
            if (match.completed) {
                result = `${match.games_won1} - ${match.games_won2}`;
            }
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${team1.name}</strong> (${team1.player1} & ${team1.player2})
                    vs
                    <strong>${team2.name}</strong> (${team2.player1} & ${team2.player2})
                </td>
                <td>${result}</td>
            `;
            matchesBody.appendChild(row);
        });
    }

    loadAllMatches();
});