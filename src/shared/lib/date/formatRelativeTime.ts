/**
 * Formats ISO date string into relative time label with correct plural forms.
 *
 * Examples:
 *  - "just now"
 *  - "1 min ago"
 *  - "5 mins ago"
 *  - "1 h ago"
 *  - "3 hrs ago"
 *  - "1 day ago"
 *  - "4 days ago"
 */
export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const timestamp = new Date(iso).getTime();

  if (Number.isNaN(timestamp)) {
    return '';
  }

  const diffMs = Math.max(0, now - timestamp);
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return 'just now';
  }

  if (diffMinutes < 60) {
    return formatWithPlural(diffMinutes, 'min', 'mins');
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return formatWithPlural(diffHours, 'h', 'hrs');
  }

  const diffDays = Math.floor(diffHours / 24);
  return formatWithPlural(diffDays, 'day', 'days');
}

/**
 * Helper for pluralized labels.
 */
function formatWithPlural(value: number, singular: string, plural: string): string {
  return `${value} ${value === 1 ? singular : plural} ago`;
}
