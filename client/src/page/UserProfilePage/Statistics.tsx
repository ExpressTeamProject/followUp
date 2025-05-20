import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, CheckCircle, MessageSquare, Award } from 'lucide-react';
import { getProblemsByUser } from '@/lib/api/problem';
import { getArticlesByUser } from '@/lib/api/community';
import { getSavedItems } from '@/lib/api/saved-items';
import { API_PATHS } from '@/lib/api/api-paths';
import { useQuery } from '@tanstack/react-query';

interface Props {
  userId: string;
}

export default function UserStatistics({ userId }: Props) {
  const { data: problemsData, isLoading: isLoadingProblems } = useQuery({
    queryKey: [API_PATHS.POSTS.BY_USER, userId],
    queryFn: () => getProblemsByUser(userId),
  });

  const { data: solvedProblemsData, isLoading: isLoadingSolvedProblems } = useQuery({
    queryKey: [API_PATHS.POSTS.BY_USER, userId],
    queryFn: () => getProblemsByUser(userId, { status: 'solved', page: 1, limit: 5 }),
  });

  const { data: articlesData, isLoading: isLoadingArticles } = useQuery({
    queryKey: [API_PATHS.ARTICLES.BY_USER, userId],
    queryFn: () => getArticlesByUser(userId),
  });

  const { data: savedItemsData } = useQuery({
    queryKey: [API_PATHS.SAVED_ITEMS, userId],
    queryFn: () => getSavedItems(),
  });

  const savedItemsLength = (savedItemsData?.data.posts.length ?? 0) + (savedItemsData?.data.articles.length ?? 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-none shadow-md dark:shadow-gray-800/30">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">등록한 문제</p>
            <p className="text-3xl font-bold">{problemsData?.pagination.totalResults ?? 0}</p>
          </div>
          <BookOpen className="h-8 w-8 text-teal-500" />
        </CardContent>
      </Card>
      <Card className="border-none shadow-md dark:shadow-gray-800/30">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">해결한 문제</p>
            <p className="text-3xl font-bold">{solvedProblemsData?.pagination.totalResults ?? 0}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-teal-500" />
        </CardContent>
      </Card>
      <Card className="border-none shadow-md dark:shadow-gray-800/30">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">커뮤니티 게시글</p>
            <p className="text-3xl font-bold">{articlesData?.pagination.totalResults ?? 0}</p>
          </div>
          <MessageSquare className="h-8 w-8 text-teal-500" />
        </CardContent>
      </Card>
      <Card className="border-none shadow-md dark:shadow-gray-800/30">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">평판</p>
            <p className="text-3xl font-bold">1850</p>
          </div>
          <Award className="h-8 w-8 text-teal-500" />
        </CardContent>
      </Card>
    </div>
  );
}
