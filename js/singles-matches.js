document.addEventListener('DOMContentLoaded', async function() {
    const matchesBody = document.getElementById('matches-body');
    const { data: matches } = await supabase.from('singles_matches').select('*');
    const { data: teams } = await supabase.from('singles_teams').select('*');
    matchesBody.innerHTML = '';
    if (!matches || matches.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="2" class="text-center">Aucun match programmé pour le moment</td>`;
        matchesBody.appendChild(row);
        return;
    }
    matches.forEach(match => {
        const team1 = teams.find(t => t.id === match.team1_id);
        const team2 = teams.find(t => t.id === match.team2_id);
        if (team1 && team2) {
            let result = "À jouer";
            if (match.completed) {
                result = `${match.games_won1} - ${match.games_won2}`;
            }
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${team1.name}</strong> vs <strong>${team2.name}</strong></td>
                <td>${result}</td>
            `;
            matchesBody.appendChild(row);
        }
    });
});