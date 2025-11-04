export type SortOrder = 'asc' | 'desc';

const SORT_KEY = 'task_table_sort_order';

export function getSavedSort(): SortOrder | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(SORT_KEY);
  return v === 'asc' || v === 'desc' ? v : null;
}

export function setSavedSort(order: SortOrder): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SORT_KEY, order);
}


