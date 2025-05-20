import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProblemCard } from '../../components/problem-card';
import { useProblemsQuery } from '@/query/useProblemsQuery';
import { PaginationQueryParams } from '@/query/_common/usePagination';
import { CircleSpinner } from '@/components/spinner';
import useFilter from '@/query/_common/useFilter';
import Pagination from '@/components/pagination';

interface ProblemContainerProps {
  activeTab: string;
  filter: ReturnType<typeof useFilter>;
  onTabChange: (value: string) => void;
  onPageChange: (value: number) => void;
  pagination: PaginationQueryParams;
}

export function ProblemContainer({ activeTab, pagination, filter, onTabChange, onPageChange }: ProblemContainerProps) {
  const { data: problems, isSuccess } = useProblemsQuery(pagination, filter);
  const handleTabChange = (value: string) => {
    onTabChange(value);
  };

  // if (!isSuccess) return <div>Loading...</div>;
  if (!isSuccess)
    return (
      <div className="flex items-center justify-center w-full h-[400px]">
        <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-teal-100 dark:bg-teal-900/30 blur-lg opacity-70"></div>
            <CircleSpinner size="xl" color="teal" className="relative z-10" />
          </div>
          <p className="text-teal-600 dark:text-teal-400 font-medium mt-4">데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );

  const filteredProblems = problems.data;
  const lastPage = problems.pagination.totalPages;
  const currentPage = problems.pagination.currentPage;

  return (
    <div className="flex-1">
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">전체 문제</TabsTrigger>
          <TabsTrigger value="solved">해결된 문제</TabsTrigger>
          <TabsTrigger value="unsolved">미해결 문제</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4">
            {filteredProblems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
            {filteredProblems.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="solved" className="mt-4">
          <div className="grid gap-4">
            {filteredProblems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
            {filteredProblems.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="unsolved" className="mt-4">
          <div className="grid gap-4">
            {filteredProblems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
            {filteredProblems.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 페이지네이션 */}
      <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={onPageChange} />
    </div>
  );
}
