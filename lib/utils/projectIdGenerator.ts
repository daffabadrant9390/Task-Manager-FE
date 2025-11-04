/**
 * Generates a project ID in the format AA-XXXX where:
 * - AA is two uppercase letters A-Z
 * - XXXX is a random 4-digit number
 */
export function generateProjectId(): string {
  const letters = Array.from({ length: 2 })
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join("");
  const digits = Math.floor(1000 + Math.random() * 9000); // 1000-9999
  return `${letters}-${digits}`;
}


