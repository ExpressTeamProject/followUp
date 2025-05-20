import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProblemCard } from '@/components/problem-card';
import { API_PATHS } from '@/lib/api/api-paths';
import { useQuery } from '@tanstack/react-query';
import { LoadingBox } from '@/components/loading-box';
import { getSavedItems } from '@/lib/api/saved-items';
import ArticleCard from '@/page/CommunityPage/ArticleList/ArticleCard';

export default function SavedItems() {
  const { data: savedProblems, isLoading } = useQuery({
    queryKey: [API_PATHS.POSTS.BY_USER],
    queryFn: () => getSavedItems(),
  });

  if (isLoading) return <LoadingBox />;

  return (
    <Card className="border-none shadow-md dark:shadow-gray-800/30">
      <CardHeader>
        <CardTitle>저장한 목록</CardTitle>
        <CardDescription>사용자가 저장한 목록입니다</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-4">
            <CardTitle>문제</CardTitle>
            {savedProblems?.data.posts.length ? (
              // @ts-expect-error Problem 타입이 재정의 필요
              savedProblems.data.posts.map(post => <ProblemCard key={post.id} problem={post} />)
            ) : (
              <p className="text-center py-8 text-muted-foreground">저장한 문제가 없습니다</p>
            )}
          </div>
          <div className="grid gap-4">
            <CardTitle>게시글</CardTitle>
            {savedProblems?.data.articles.length ? (
              savedProblems.data.articles.map(article => <ArticleCard key={article.id} article={article} />)
            ) : (
              <p className="text-center py-8 text-muted-foreground">저장한 게시글이 없습니다</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
