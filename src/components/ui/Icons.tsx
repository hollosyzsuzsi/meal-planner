export function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" strokeLinejoin="round" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3.5l2 1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SwapIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 5h12M11 2l3 3-3 3M14 11H2M5 8l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function Spinner({ large }: { large?: boolean }) {
  const size = large ? 24 : 14;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ animation: 'spin 0.8s linear infinite' }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

export function WarnIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}><path d="M8 1.5L1 13.5h14L8 1.5z" strokeLinejoin="round"/><path d="M8 6v4M8 11.5v.5" strokeLinecap="round"/></svg>;
}

export function InfoIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}><circle cx="8" cy="8" r="6.5"/><path d="M8 7v4M8 5.5v.5" strokeLinecap="round"/></svg>;
}
export function SettingsIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" strokeLinecap="round"/></svg>;
}

export function CheckIcon() {
  return <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function MealsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 13V7a6 6 0 0 1 12 0v6" strokeLinecap="round" />
      <path d="M1 13h14" strokeLinecap="round" />
      <path d="M8 4v3" strokeLinecap="round" />
    </svg>
  );
}

export function PlannerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="11" rx="2" />
      <path d="M5 1v4M11 1v4M2 7h12" strokeLinecap="round" />
    </svg>
  );
}

export function ShoppingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 2h1.5l2 7h6l1.5-5H5.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function RemoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8h10" strokeLinecap="round" />
    </svg>
  );
}