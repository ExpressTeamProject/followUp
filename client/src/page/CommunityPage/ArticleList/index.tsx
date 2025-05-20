import Pagination from '@/components/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'react-router';
import { communityFilterSchema } from '@/lib/validations/community';
import ArticleCard from './ArticleCard';
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/lib/api/community';
import { ARTICLE_CATEGORY_VALUES } from '@/config/options';
import { ALL_VALUE } from '@/config/constant';
import { LoadingBox } from '@/components/loading-box';
import { API_PATHS } from '@/lib/api/api-paths';

export default function ArticleList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category, page, limit, search, tags } = communityFilterSchema.parse(Object.fromEntries(searchParams));
  const { data: resArticles, isLoading } = useQuery({
    queryKey: [API_PATHS.ARTICLES.ROOT, { category, page, limit, search, tags }],
    queryFn: () => getArticles({ category, page, limit, search, tags }),
  });

  const onTabChange = (value: string) => {
    setSearchParams(prev => {
      prev.set('category', value);
      prev.set('page', '1');
      return prev;
    });
  };

  const onPageChange = (value: number) => {
    setSearchParams(prev => {
      prev.set('page', value.toString());
      return prev;
    });
  };

  return (
    <div className="flex-1">
      <Tabs defaultValue={ALL_VALUE} className="mb-6" value={category} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value={ALL_VALUE}>{ALL_VALUE}</TabsTrigger>
          {ARTICLE_CATEGORY_VALUES.filter(value => value !== '기타').map(value => (
            <TabsTrigger key={value} value={value} className="cursor-pointer">
              {value}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <div className="grid gap-4 mt-4">
            {resArticles?.data.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">게시글이 없습니다.</p>
              </div>
            ) : (
              resArticles?.data.map(article => <ArticleCard key={article.id} article={article} />)
            )}
          </div>
          <Pagination
            currentPage={page}
            lastPage={resArticles?.pagination.totalPages ?? 0}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
