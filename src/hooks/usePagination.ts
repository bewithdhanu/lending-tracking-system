import { useState, useMemo } from 'react';

export function usePagination<T>(items: T[], pageSize: number = 20) {
  const [currentPage, setCurrentPage] = useState(0);

  const paginatedItems = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [items, currentPage, pageSize]);

  return {
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalItems: items.length,
    pageSize,
  };
}