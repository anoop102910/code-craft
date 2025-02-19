import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

type SortDirection = 'asc' | 'desc';
type SortField = 'name' | 'size' | 'createdAt';

interface Sortable {
  name: string;
  size: number;
  createdAt: string;
}

export function sortItems<T extends Sortable>(
  items: T[],
  field: SortField,
  direction: SortDirection
): T[] {
  return [...items].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}
