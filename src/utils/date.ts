export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  return d;
}

export function getThisMonday(): string {
  return getMonday(new Date()).toISOString().split('T')[0];
}

export function formatWeekLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const end = new Date(date);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${fmt(date)} – ${fmt(end)}`;
}