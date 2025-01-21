export function mikrotikUptimeToDays(uptime: string): string {
  const weeksMatch = uptime.match(/(\d+)w/);
  const daysMatch = uptime.match(/(\d+)d/);

  const weeks = weeksMatch ? parseInt(weeksMatch[1]) : 0;
  const days = daysMatch ? parseInt(daysMatch[1]) : 0;

  const totalDays = weeks * 7 + days;

  return `${totalDays}d`;
}
