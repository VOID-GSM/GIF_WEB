export const matchesTeamQuery = (teamName: string, query: string) =>
  teamName.toLowerCase().includes(query.trim().toLowerCase());
