import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Filter, Plus, Search } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import { ProblemContainer } from '@/page/ProblemsPage/ProblemContainer';
import { usePagination } from '@/query/_common/usePagination';
import useFilter from '@/query/_common/useFilter';
import { POPULAR_TAGS, PROBLEM_STATUSES, SORT_OPTIONS } from '@/config/options';

export default function ProblemsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const pagination = usePagination({ page: 1 });
  const filter = useFilter();

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    filter.toggleCategory(category);
  };

  // 상태 변경 핸들러
  const handleStatusChange = (status: string) => {
    filter.setStatus(status as (typeof PROBLEM_STATUSES)[number]);
  };

  // 태그 변경 핸들러
  const handleTagChange = (tag: string) => {
    filter.toggleTag(tag);
  };

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filter.setStatus(value as (typeof PROBLEM_STATUSES)[number]);
  };

  return (
    <div className="container py-8 px-4 md:px-8 max-w-full mx-auto">
      <div className="flex flex-col gap-6">
        {/* 헤더 섹션 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <BookOpen className="mr-2 h-8 w-8 text-teal-500" />
              문제 목록
            </h1>
            <p className="text-muted-foreground mt-1">다양한 전공 분야의 문제를 탐색하고 해결해보세요</p>
          </div>
          <div className="flex gap-2">
            <Link to="/problems/new">
              <Button className="rounded-full bg-teal-500 hover:bg-teal-600 transition-colors">
                <Plus className="mr-2 h-4 w-4" /> 문제 등록
              </Button>
            </Link>
            <Button variant="outline" className="rounded-full md:hidden" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              필터
            </Button>
          </div>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="문제 검색..."
              className="pl-10 py-6 rounded-full border-gray-300 dark:border-gray-700 focus-visible:ring-teal-500"
              value={pagination.search}
              onChange={e => pagination.setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={pagination.sort}
              onValueChange={value => pagination.setSort(value as '-createdAt' | 'popular' | 'comments')}
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
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* 사이드바 - 모바일에서는 토글 가능 */}
          <FilterSidebar
            showFilters={showFilters}
            selectedStatus={filter.status}
            handleStatusChange={handleStatusChange}
            toggleCategory={handleCategoryChange}
            toggleTag={handleTagChange}
            popularTags={POPULAR_TAGS}
            selectedTags={Array.from(filter.tags)}
            categories={filter.categories}
          />

          {/* 문제 목록 */}
          <ProblemContainer
            pagination={pagination}
            filter={filter}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onPageChange={pagination.setPage}
          />
        </div>
      </div>
    </div>
  );
}
