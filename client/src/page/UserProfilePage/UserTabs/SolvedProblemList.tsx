import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProblemCard } from '@/components/problem-card';
import { API_PATHS } from '@/lib/api/api-paths';
import { useState } from 'react';
import { useParams } from 'react-router';
import { strIdSchema } from '@/lib/validations/common';
import { useQuery } from '@tanstack/react-query';
import { getProblemsByUser } from '@/lib/api/problem';
import Pagination from '@/components/pagination';
import { LoadingBox } from '@/components/loading-box';

export default function SolvedProblemList() {
  const params = useParams();
  const userId = strIdSchema.parse(params.id);
  const [page, setPage] = useState(1);

  const { data: solvedProblems, isLoading } = useQuery({
    queryKey: [API_PATHS.POSTS.BY_USER, userId, page, 'solved'],
    queryFn: () => getProblemsByUser(userId, { page, limit: 5, status: 'solved' }),
  });

  if (isLoading) return <LoadingBox />;

  return (
    <Card className="border-none shadow-md dark:shadow-gray-800/30">
      <CardHeader>
        <CardTitle>해결한 문제</CardTitle>
        <CardDescription>사용자가 해결한 문제 목록입니다</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {solvedProblems?.data.length && solvedProblems.data.length > 0 ? (
            solvedProblems.data.map(problem => <ProblemCard key={problem.id} problem={problem} />)
          ) : (
            <p className="text-center py-8 text-muted-foreground">해결한 문제가 없습니다</p>
          )}
        </div>
        <Pagination currentPage={page} lastPage={solvedProblems?.pagination.totalPages ?? 0} onPageChange={setPage} />
      </CardContent>
    </Card>
  );
}
