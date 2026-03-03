import type { Book, Loan, PaginationMeta } from '@/types';

// Default empty pagination to avoid repeating the same literal everywhere
export const EMPTY_PAGINATION: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

// --- API → Frontend field mappers ---

// Backend uses: rating, reviewCount, totalCopies, availableCopies
// Frontend uses: averageRating, totalReviews, stock, availableStock
export function mapBook(b: Record<string, unknown>): Book {
  return {
    ...(b as unknown as Book),
    averageRating: (b.rating as number) ?? 0,
    totalReviews: (b.reviewCount as number) ?? 0,
    stock: (b.totalCopies as number) ?? 0,
    availableStock: (b.availableCopies as number) ?? 0,
  };
}

// Backend uses: borrowedAt, dueAt, returnedAt
// Frontend uses: borrowDate, dueDate, returnDate
export function mapLoan(l: Record<string, unknown>): Loan {
  return {
    ...(l as unknown as Loan),
    borrowDate: (l.borrowedAt as string) ?? '',
    dueDate: (l.dueAt as string) ?? '',
    returnDate: l.returnedAt as string | undefined,
  };
}

// Helper to extract paginated list from API response
export function extractPaginated<T>(
  data: Record<string, unknown>,
  key: string,
  mapper?: (item: Record<string, unknown>) => T,
): { data: T[]; meta: PaginationMeta } {
  const items = (data?.[key] ?? []) as Record<string, unknown>[];
  const pagination = (data?.pagination ?? EMPTY_PAGINATION) as PaginationMeta;
  return {
    data: mapper ? items.map(mapper) : (items as unknown as T[]),
    meta: pagination,
  };
}
