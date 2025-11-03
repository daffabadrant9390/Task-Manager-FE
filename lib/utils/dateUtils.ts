/**
 * Converts date string from "30 Oct 2025" format to "YYYY-MM-DD" format
 */
export function parseDateString(dateStr: string): string {
  if (!dateStr) return "";
  
  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

/**
 * Converts date from "YYYY-MM-DD" format to "30 Oct 2025" format
 */
export function formatDateString(dateStr: string): string {
  if (!dateStr) return "";
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr; // Return original if invalid
    }
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
