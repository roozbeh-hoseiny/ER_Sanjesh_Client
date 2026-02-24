/**
 * Return the Unix timestamp in seconds for the provided date (or now).
 *
 * Examples:
 *  getUnixSeconds() -> 1698470400
 *  getUnixSeconds(new Date('2025-10-27T00:00:00Z')) -> 1740720000
 */
export function timeToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Format duration string to Persian format
 * Returns formatted string with hours, minutes, and/or seconds
 * Excludes zero values from the output
 *
 * Examples:
 *  formatDurationToText("01:30:00") -> "1 ساعت و 30 دقیقه"
 *  formatDurationToText("00:30:00") -> "30 دقیقه"
 *  formatDurationToText("01:00:00") -> "1 ساعت"
 *  formatDurationToText("00:00:30") -> "30 ثانیه"
 */
export function formatDurationToText(time: string): string {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ساعت`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} دقیقه`);
  }

  if (seconds > 0) {
    parts.push(`${seconds} ثانیه`);
  }

  return parts.join(' و ');
}

export default { timeToSeconds, formatDurationToText };
