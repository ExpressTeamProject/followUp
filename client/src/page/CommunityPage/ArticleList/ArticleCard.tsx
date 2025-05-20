import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router';
import { CATEGORY_COLORS } from '@/config/mappers';
import type { ResArticle } from '@/types/article';
import { format } from 'date-fns';
import { DATE_FORMAT } from '@/config/constant';
import useAuthStore from '@/store/useAuthStore';
interface Props {
  article: ResArticle;
}

export default function ArticleCard({ article }: Props) {
  const { user } = useAuthStore();
  const didILike = article.likes.some(like => like === user?.id);
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg dark:shadow-gray-800/30 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={article.author.profileImage || '/placeholder.svg'} alt={article.author.username} />
              <AvatarFallback>{article.author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <span className="font-medium">{article.author.username}</span>
              <p className="text-xs text-muted-foreground">
                {format(article.createdAt, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)}
              </p>
            </div>
          </div>
          <Badge className={CATEGORY_COLORS[article.category as keyof typeof CATEGORY_COLORS]}>
            {article.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Link to={`/community/${article.id}`} className="hover:text-teal-500 transition-colors">
          <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
        </Link>
        <CardDescription className="line-clamp-2">{article.content}</CardDescription>
        <div className="flex flex-wrap gap-2 mt-3">
          {article.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex gap-6">
          <div className="flex items-center gap-1 text-sm">
            <ThumbsUp className={`h-4 w-4 ${didILike ? 'text-teal-500' : 'text-gray-500'}`} />
            <span>{article.likeCount}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MessageSquare className="h-4 w-4" />
            <span>{article.commentCount}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
