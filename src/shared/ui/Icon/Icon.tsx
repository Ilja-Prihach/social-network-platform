export const Icon = ({ name, size = 24 }: { name: string; size?: number }) => (
  <svg width={size} height={size} fill="currentColor">
    <use href={`#${name}`} />
  </svg>
);
