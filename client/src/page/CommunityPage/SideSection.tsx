import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'react-router';
import { communityFilterSchema } from '@/lib/validations/community';
import { getPopularTags } from '@/lib/api/community';
import { useQuery } from '@tanstack/react-query';
import { API_PATHS } from '@/lib/api/api-paths';

export default function SideSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tags } = communityFilterSchema.parse(Object.fromEntries(searchParams));

  const { data: popularTags } = useQuery({
    queryKey: [API_PATHS.ARTICLES.POPULAR_TAGS],
    queryFn: getPopularTags,
  });

  const onTagClick = (tag: string) => {
    setSearchParams(prev => {
      const currentTags = prev.get('tags')?.split(',') || [];
      const newTags = currentTags.includes(tag) ? currentTags.filter(t => t !== tag) : [...currentTags, tag];
      prev.set('tags', newTags.join(','));
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <div className="md:w-1/4 lg:w-1/5 space-y-6">
      <Card className="overflow-hidden border-none shadow-md dark:shadow-gray-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">인기 태그</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags?.data.map(tag => (
              <Badge
                key={tag.tag}
                variant={tags?.includes(tag.tag) ? 'default' : 'secondary'}
                onClick={() => onTagClick(tag.tag)}
                className="cursor-pointer"
              >
                #{tag.tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md dark:shadow-gray-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">커뮤니티 가이드</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
              <span>서로 존중하는 대화를 나눠주세요</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
              <span>학문적 토론과 정보 공유를 권장합니다</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
              <span>출처를 명확히 밝혀주세요</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
              <span>광고성 글은 삼가주세요</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
