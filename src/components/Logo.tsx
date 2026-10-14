export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true" className="flex-none">
      <circle cx="22" cy="22" r="20.5" fill="none" stroke="#E2B65C" strokeWidth="1.5" />
      <path d="M22 9v26M14 17h16" stroke="#EEF3EC" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M6 29c5-3 9-3 13 0s9 3 13 0 6-2 6-2" fill="none" stroke="#E2B65C" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
