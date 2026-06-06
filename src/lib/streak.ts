/**
 * Logic for updating user streaks.
 * @param lastUpdated The date the streak was last updated.
 * @param currentStreak The current streak count.
 * @returns The new streak count.
 */
export function calculateNewStreak(lastUpdated: Date, currentStreak: number): number {
  const now = new Date();
  
  // Set times to midnight for comparison
  const last = new Date(lastUpdated);
  last.setHours(0, 0, 0, 0);
  
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(today.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already updated today
    return currentStreak;
  } else if (diffDays === 1) {
    // Consecutive day
    return currentStreak + 1;
  } else {
    // Streak broken
    return 1;
  }
}
