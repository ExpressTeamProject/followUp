import { useQuery } from '@tanstack/react-query';
import { PaginationQueryParams } from './_common/usePagination';
import { kyInstance } from '@/lib/kyInstance';
import { Problem } from '@/models/Problem';
import { FilterQueryParams } from './_common/useFilter';

interface PaginationQueryResponse<T> {
  data: T[];
  count: number;
  pagination: { currentPage: number; totalPages: number };
  success: boolean;
}

function getProblems(
  pagination: PaginationQueryParams = { page: 1 },
  filter: FilterQueryParams = { status: 'all', tags: new Set(), categories: new Set() },
): Promise<PaginationQueryResponse<Problem>> {
  const endpoint = new URLSearchParams();
  if (pagination.search) endpoint.set('search', pagination.search);
  if (pagination.tags) endpoint.set('tags', pagination.tags.join(','));
  if (pagination.status) endpoint.set('status', pagination.status);
  if (pagination.sort) endpoint.set('sort', pagination.sort);
  if (pagination.page) endpoint.set('page', pagination.page.toString());
  if (pagination.limit) endpoint.set('limit', pagination.limit.toString());

  if (filter.status) endpoint.set('status', filter.status);
  if (filter.tags) endpoint.set('tags', Array.from(filter.tags).join(','));
  if (Array.from(filter.categories).length > 0) endpoint.set('category', Array.from(filter.categories).join(','));

  console.log(filter);

  return kyInstance.get('posts?' + endpoint.toString()).json();
}

export const useProblemsQuery = (
  pagination?: PaginationQueryParams,
  filter: FilterQueryParams = { status: 'all', tags: new Set(), categories: new Set() },
) => {
  return useQuery({
    queryKey: [
      'problems',
      { ...pagination },
      'filter',
      filter,
      { categories: Array.from(filter.categories), tags: Array.from(filter?.tags), status: filter?.status },
    ],
    queryFn: () => getProblems(pagination, filter),
  });
};
