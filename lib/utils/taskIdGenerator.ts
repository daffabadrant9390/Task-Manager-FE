/**
 * Generates a task ID in the format TASK-XXXX where XXXX is a random 4-digit number
 */
export function generateTaskId(): string {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 1000-9999
  return `TASK-${randomNumber}`;
}

