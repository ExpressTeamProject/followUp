import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Search } from 'lucide-react';
import { PaginationQueryParams, usePagination } from '@/query/_common/usePagination';
import { useProblemsQuery } from '@/query/useProblemsQuery';
import { Category, Problem } from '@/models/Problem';
import { CircleSpinner } from '@/components/spinner';
import Pagination from '@/components/pagination';
import { useState, useEffect } from 'react';
import { SolutionModal } from '@/components/SolutionModal';
import { Link } from 'react-router';
import { useDebounce } from 'use-debounce';
import useFilter from '@/query/_common/useFilter';
import { PROBLEM_CATEGORY_OPTIONS, SORT_OPTIONS } from '@/config/options';

export default function SolvedProblemsPage() {
  const filter = useFilter();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 500);
  const pagination = usePagination({ page: 1, status: 'solved', sort: '-createdAt' });
  const { data: solvedProblemsRes, isLoading } = useProblemsQuery(pagination, {
    ...filter,
    status: 'solved',
  });

  useEffect(() => {
    pagination.setSearch(debouncedSearch);
    pagination.setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const solvedProblems = solvedProblemsRes?.data ?? [];

  return (
    <div className="container py-8 px-4 md:px-8 max-w-full mx-auto">
      <div className="flex flex-col gap-6">
        {/* 헤더 섹션 */}
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <CheckCircle className="mr-2 h-8 w-8 text-teal-500" />
            해결된 문제
          </h1>
          <p className="text-muted-foreground mt-1">
            다른 사용자들이 해결한 문제들을 확인하고 다양한 해결 방법을 배워보세요
          </p>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="해결된 문제 검색..."
              className="pl-10 py-6 rounded-full border-gray-300 dark:border-gray-700 focus-visible:ring-teal-500"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={pagination.sort}
              onValueChange={value => pagination.setSort((value as PaginationQueryParams['sort'])!)}
            >
              <SelectTrigger className="w-[140px] rounded-full">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={Array.from(filter.categories)[0]}
              onValueChange={value => filter.setSingleCategory(value as Category)}
            >
              <SelectTrigger className="w-[140px] rounded-full">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체</SelectItem>
                {PROBLEM_CATEGORY_OPTIONS.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-teal-100 dark:bg-teal-900/30 blur-lg opacity-70"></div>
                <CircleSpinner size="xl" color="teal" className="relative z-10" />
              </div>
              <p className="text-teal-600 dark:text-teal-400 font-medium mt-4">데이터를 불러오는 중입니다...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {solvedProblems.map(problem => (
              <SolvedProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        <Pagination
          currentPage={pagination.page}
          lastPage={solvedProblemsRes?.pagination.totalPages ?? 0}
          onPageChange={pagination.setPage}
        />
      </div>
    </div>
  );
}

// 해결된 문제 카드 컴포넌트
function SolvedProblemCard({ problem }: { problem: Problem }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg dark:shadow-gray-800/30 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2">
              {problem.categories.map(category => (
                <Badge key={category} variant="outline" className="self-start mb-2 bg-gray-50 dark:bg-gray-800">
                  {category}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-xl hover:text-teal-500 transition-colors">
              <Link to={`/problems/${problem.id}`}>{problem.title}</Link>
            </CardTitle>
            <CardDescription className="mt-0.5 line-clamp-2">{problem.content}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">해결자:</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={problem.author.profileImage || '/placeholder.svg'} alt={problem.author.nickname} />
                <AvatarFallback>{problem.author.nickname.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{problem.author.nickname}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M7 10v12" />
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
              </svg>
              <span>{problem.likeCount}</span>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => setShowSolution(true)}>
              해결책 보기
            </Button>
          </div>
        </div>
      </CardContent>
      <SolutionModal isOpen={showSolution} onClose={() => setShowSolution(false)} problem={problem} />
    </Card>
  );
}
