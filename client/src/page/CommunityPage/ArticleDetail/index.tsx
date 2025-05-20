import { API_PATHS } from '@/lib/api/api-paths';
import { getArticle, downloadArticleAttachment, toggleArticleLike, deleteArticle } from '@/lib/api/community';
import { useMutation, useQuery } from '@tanstack/react-query';
import { strIdSchema } from '@/lib/validations/common';
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MarkdownViewer } from '@/components/markdown-viewer';
import { ArrowLeft, Bookmark, Edit2, MessageSquare, Share2, ThumbsUp, Trash2 } from 'lucide-react';
import ShareSuccessModal from '@/page/ShareSuccessPage';
import { LoadingBox } from '@/components/loading-box';
import { ROUTE_SEGMENT, ROUTES } from '@/lib/router/routes';
import type { ResAttachment } from '@/types/common';
import { useFileDownload } from '@/hooks/useDownload';
import { format } from 'date-fns';
import { DATE_FORMAT } from '@/config/constant';
import useAuthStore from '@/store/useAuthStore';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { ArticleCommentSection } from './CommentSection';
import { checkSavedItem, toggleSavedItem } from '@/lib/api/saved-items';
import { toast } from 'sonner';

export default function ArticleDetail() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const params = useParams();
  const articleId = strIdSchema.parse(params.id);
  const { downloadFile, isDownloading } = useFileDownload();

  const { data: articleRes, isLoading } = useQuery({
    queryKey: [API_PATHS.ARTICLES.DETAIL, articleId],
    queryFn: () => getArticle(articleId || ''),
  });

  const { data: checkSaved } = useQuery({
    queryKey: [API_PATHS.SAVED_ITEMS.CHECK, articleId],
    queryFn: () => checkSavedItem(articleId, 'article'),
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => toggleArticleLike(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_PATHS.ARTICLES.DETAIL, articleId] });
    },
  });
  const { mutate: removeArticle } = useMutation({
    mutationFn: () => deleteArticle(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_PATHS.ARTICLES.DETAIL, articleId] });
      navigate(ROUTES.COMMUNITY.LIST);
    },
  });

  const { mutate: toggleSaved } = useMutation({
    mutationFn: () => toggleSavedItem(articleId, 'article'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_PATHS.ARTICLES.DETAIL, articleId] });
      queryClient.invalidateQueries({ queryKey: [API_PATHS.SAVED_ITEMS.CHECK, articleId] });
      toast.success('저장되었습니다.');
    },
  });

  const [showShareSuccess, setShowShareSuccess] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareSuccess(true);
  };

  const handleEdit = () => {
    navigate(ROUTES.COMMUNITY.EDIT.replace(ROUTE_SEGMENT.ID, articleId));
  };

  const handleDelete = () => {
    removeArticle();
  };

  const handleDownload = async (file: ResAttachment) => {
    try {
      downloadFile(downloadArticleAttachment(file.filename), file.originalname);
    } catch (error) {
      console.error(error);
      toast.error('첨부 파일을 다운로드 하는 중 오류가 발생했습니다.');
    }
  };

  const handleSave = () => {
    if (!user) {
      toast.warning('로그인 후 이용해주세요.');
      return;
    }
    toggleSaved();
  };

  const handleToggleLike = () => {
    if (!user) {
      toast.warning('로그인 후 이용해주세요.');
      return;
    }
    toggleLike();
  };

  const getCategoryColorClass = (category: string) => {
    const categoryColors: Record<string, string> = {
      질문: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      정보: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      모집: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      후기: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      잡담: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };

    return categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const article = articleRes?.data;

  if (isLoading) return <LoadingBox />;

  const didILike = article?.likes?.some(like => like === user?.id);

  if (!article) {
    return (
      <div className="container py-8 px-4 md:px-8 max-w-full mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            요청하신 게시글이 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
          <Button asChild>
            <Link to={`${ROUTES.COMMUNITY.LIST}`}>커뮤니티로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showShareSuccess && <ShareSuccessModal onComplete={() => setShowShareSuccess(false)} />}

      <main className="flex-1 container py-8 px-4 md:px-8 max-w-full mx-auto">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <div className="flex items-center">
            <Link
              to={`${ROUTES.COMMUNITY.LIST}`}
              className="flex items-center text-gray-500 hover:text-teal-500 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              커뮤니티로 돌아가기
            </Link>
          </div>

          <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8 border-none">
            <CardHeader className="p-6 pb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getCategoryColorClass(article.category)}>{article.category}</Badge>

                {article.tags?.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-2xl font-bold mb-4">{article.title}</h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={article.author.profileImage || '/placeholder.svg'}
                      alt={article.author.nickname}
                    />
                    <AvatarFallback>{article.author.nickname.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{article.author.nickname}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(article.createdAt), DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)}
                      {article.updatedAt !== article.createdAt && ' (수정됨)'}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">조회 {article.viewCount}</div>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="prose dark:prose-invert max-w-none">
                <MarkdownViewer content={article.content} />
              </div>
              {article.attachments && article.attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-3 px-4">첨부 파일</h3>
                  <div className="space-y-2">
                    {article.attachments.map(file => (
                      <div key={file.id} className="flex items-center p-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <div className="flex-1 truncate">{file.originalname}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-teal-600 hover:text-teal-700"
                          onClick={() => handleDownload(file)}
                          disabled={isDownloading}
                        >
                          {isDownloading ? '다운로드 중...' : '다운로드'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-wrap justify-between gap-y-3 p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 ${
                    didILike ? 'text-teal-500 dark:text-teal-400' : ''
                  }`}
                  onClick={handleToggleLike}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{article.likeCount}</span>
                </Button>
                <div className="text-sm flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <MessageSquare className="h-4 w-4" />
                  <span>댓글 ({article.comments?.length || 0})</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 ${
                    checkSaved?.isSaved ? 'text-teal-500 dark:text-teal-400' : ''
                  }`}
                  onClick={handleSave}
                >
                  <Bookmark className="h-4 w-4" />
                  <span>저장</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  <span>공유</span>
                </Button>

                {/* 작성자만 볼 수 있는 수정/삭제 버튼 */}
                {article.author._id === user?.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      onClick={handleEdit}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>수정</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>삭제</span>
                    </Button>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-none">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-teal-500" />
              댓글
            </h2>
            <ArticleCommentSection articleId={article.id} />
          </div>
        </div>
      </main>
    </>
  );
}
