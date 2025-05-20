import { useProblemDetailQuery } from './useProblemDetailQuery';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MarkdownViewer } from '../markdown-viewer';
import { Bookmark, CheckCircle, Circle, Edit2, MessageSquare, Share2, ThumbsUp, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { CommentSection } from '../comment/comment-section';
import { useState } from 'react';
import ShareSuccessModal from '@/page/ShareSuccessPage';
import { CircleSpinner } from '../spinner';
import useToggleLikeProblemMutation from './useToggleLikeProblemMutation';
import useToggleSolvedStatusMutation from './useToggleSolvedStatusMutation';
import { useNavigate } from 'react-router';
import useAuthStore from '@/store/useAuthStore';
import useDeleteProblemMutation from './useDeleteProblemMutation';
import { useFileDownload } from '@/hooks/useDownload';
import { Attachment } from '@/models/Problem';
import { downloadProblemAttachment } from '@/lib/api/problem';
import { toast } from 'sonner';
import { checkSavedItem, toggleSavedItem } from '@/lib/api/saved-items';
import { API_PATHS } from '@/lib/api/api-paths';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/tanstack-query/query-client';

function ProblemDetailCard({ problemId }: { problemId: string }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: problemRes, isSuccess } = useProblemDetailQuery(problemId || '0');
  const { mutate: toggleLikeProblem } = useToggleLikeProblemMutation(problemId || '0');
  const { mutate: toggleSolvedStatus } = useToggleSolvedStatusMutation(problemId || '0');
  const { mutate: deleteProblem } = useDeleteProblemMutation(problemId || '0');
  const { downloadFile, isDownloading } = useFileDownload();

  // 저장 상태 확인 쿼리 추가
  const { data: checkSaved } = useQuery({
    queryKey: [API_PATHS.SAVED_ITEMS.CHECK, problemId],
    queryFn: () => checkSavedItem(problemId, 'post'),
    enabled: !!user, // 사용자가 로그인한 경우에만 실행
  });

  // 저장 토글 뮤테이션 추가
  const { mutate: toggleSaved } = useMutation({
    mutationFn: () => toggleSavedItem(problemId, 'post'),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_PATHS.SAVED_ITEMS.CHECK, problemId] });
      toast.success(data.message || '저장되었습니다');
    },
    onError: (error) => {
      console.error('저장 오류:', error);
      toast.error('저장 중 오류가 발생했습니다');
    }
  });

  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareSuccess(true);
  };

  const handleEdit = () => {
    // 수정 페이지로 이동
    navigate(`/problems/${problemId}/edit`);
  };

  const handleDelete = () => {
    // 삭제 확인 및 처리 로직
    deleteProblem();
  };

  const handleDownload = async (file: Attachment) => {
    try {
      console.log(file);
      await downloadFile(downloadProblemAttachment(file.filename), file.originalname);
    } catch (error) {
      console.error(error);
      toast.error('첨부 파일을 다운로드 하는 중 오류가 발생했습니다.');
    }
  };

  // 저장 핸들러 추가
  const handleSave = () => {
    if (!user) {
      toast.warning('로그인 후 이용해주세요.');
      return;
    }
    toggleSaved();
  };

  const isAuthor = user?.username === problemRes?.data.author.username;
  const isAdmin = user?.role === 'admin';

  if (!isSuccess)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-teal-100 dark:bg-teal-900/30 blur-lg opacity-70"></div>
            <CircleSpinner size="xl" color="teal" className="relative z-10" />
          </div>
          <p className="text-teal-600 dark:text-teal-400 font-medium mt-4">데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );

  const problem = problemRes.data;
  return (
    <>
      {showShareSuccess && <ShareSuccessModal onComplete={() => setShowShareSuccess(false)} />}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="bg-white dark:bg-gray-800">
              {problem.categories.map(category => category).join(', ')}
            </Badge>
            {problem.tags?.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              >
                {tag}
              </Badge>
            ))}
            {problem.isSolved && (
              <Badge className="ml-auto bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                해결됨
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <div className="flex items-center gap-2 mt-3">
            <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800">
              <AvatarImage src={'/placeholder.svg'} alt={problem.author.username} />
              <AvatarFallback>{problem.author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <span className="font-medium">{problem.author.username}</span>
              <span className="text-gray-500 dark:text-gray-400">• {problem.createdAt?.toLocaleDateString?.()}</span>
            </div>
          </div>
        </div>

        <div className="p-6 ">
          <div className="prose dark:prose-invert max-w-none">
            <MarkdownViewer content={problem.content} />
          </div>
        </div>
        {problem.attachments && problem.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-3 px-4">첨부 파일</h3>
            <div className="space-y-2">
              {problem.attachments.map(file => (
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

        <div className="flex flex-wrap justify-between gap-y-3 p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400"
              onClick={() => toggleLikeProblem()}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{problem.likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400"
            >
              <MessageSquare className="h-4 w-4" />
              <span>댓글 ({problem.comments.length})</span>
            </Button>
            <Button
              variant={problem.isSolved ? 'default' : 'ghost'}
              size="sm"
              onClick={() => toggleSolvedStatus()}
              className={`flex items-center gap-1.5 transition-all duration-200 ${
                problem.isSolved
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                  : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
            >
              {problem.isSolved ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              <span>{problem.isSolved ? '해결됨' : '해결 표시하기'}</span>
            </Button>
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

            {/* 수정 버튼 */}
            {(isAuthor || isAdmin) && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                onClick={handleEdit}
              >
                <Edit2 className="h-4 w-4" />
                <span>수정</span>
              </Button>
            )}

            {/* 삭제 버튼 */}
            {(isAuthor || isAdmin) && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span>삭제</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-teal-500" />
          답변
        </h2>
        <CommentSection problemId={problem.id} />
      </div>
    </>
  );
}

export default ProblemDetailCard;