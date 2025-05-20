import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { API_PATHS } from '@/lib/api/api-paths';
import { getProblemsByUser } from '@/lib/api/problem';
import { useParams } from 'react-router';
import { useState } from 'react';
import { strIdSchema } from '@/lib/validations/common';
import { LoadingBox } from '@/components/loading-box';
import { ProblemCard } from '@/components/problem-card';
import Pagination from '@/components/pagination';
import { getArticlesByUser } from '@/lib/api/community';
import ArticleCard from '@/page/CommunityPage/ArticleList/ArticleCard';

export default function ArticleList() {
  const params = useParams();
  const userId = strIdSchema.parse(params.id);
  const [page, setPage] = useState(1);

  const { data: articles, isLoading } = useQuery({
    queryKey: [API_PATHS.ARTICLES.BY_USER, userId, page],
    queryFn: () => getArticlesByUser(userId, { page, limit: 5 }),
  });

  if (isLoading) return <LoadingBox />;

  return (
    <Card className="border-none shadow-md dark:shadow-gray-800/30">
      <CardHeader>
        <CardTitle>등록한 문제</CardTitle>
        <CardDescription>사용자가 등록한 문제 목록입니다</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {articles?.data.length ? (
            articles.data.map(article => <ArticleCard key={article.id} article={article} />)
          ) : (
            <p className="text-center py-8 text-muted-foreground">등록한 문제가 없습니다</p>
          )}
        </div>
        <Pagination currentPage={page} lastPage={articles?.pagination.totalPages ?? 0} onPageChange={setPage} />
      </CardContent>
    </Card>
  );
}
