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

export default { timeToSeconds };
