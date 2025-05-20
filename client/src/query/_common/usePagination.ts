import { PROBLEM_STATUSES, SORT_VALUES } from '@/config/options';
import { useState } from 'react';

export interface PaginationQueryParams {
  page: number;
  limit?: number;
  sort?: (typeof SORT_VALUES)[number];
  search?: string;
  tags?: string[];
  status?: (typeof PROBLEM_STATUSES)[number];
}

export const usePagination = (initial?: PaginationQueryParams) => {
  const [page, setPage] = useState(initial?.page ?? 1);
  const [limit, setLimit] = useState(initial?.limit ?? 5);
  const [sort, setSort] = useState(initial?.sort ?? '-createdAt');
  const [search, setSearch] = useState(initial?.search ?? undefined);
  const [tags, setTags] = useState(initial?.tags ?? []);
  const [status, setStatus] = useState(initial?.status ?? undefined);

  return {
    page,
    limit,
    sort,
    search,
    tags,
    status,
    setPage,
    setLimit,
    setSort,
    setSearch,
    setTags,
    setStatus,
  };
};
