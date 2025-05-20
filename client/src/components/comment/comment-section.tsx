import type React from 'react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardFooter } from '../ui/card';
import { ThumbsUp, MessageSquare, Flag, CornerDownRight } from 'lucide-react';
import { MarkdownEditor } from '../markdown-editor';
import { MarkdownViewer } from '../markdown-viewer';
import { Comment } from '@/models/Comment';
import { Problem } from '@/models/Problem';
import useCommentByProblemIdQuery from './useCommentByProblemIdQuery';
import useNewCommentMutation, { NewCommentParams } from './useNewCommentMutation';
import useNewReplyMutation, { NewReplyParams } from './useNewReplyMutation';
import useToggleLikeCommentMutation from './useToggleLikeCommentMutation';

interface CommentSectionProps {
  problemId: Problem['id'];
  hasNewComment?: boolean;
  hasReply?: boolean;
}

export function CommentSection({ problemId, hasNewComment = true, hasReply = true }: CommentSectionProps) {
  const { data: comments, isSuccess } = useCommentByProblemIdQuery(problemId);
  const { mutate: createNewComment } = useNewCommentMutation();
  const { mutate: createNewReply } = useNewReplyMutation();
  const { mutate: toggleLikeComment } = useToggleLikeCommentMutation();

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment['id'] | null>(null);
  const [replyContent, setReplyContent] = useState('');

  if (!isSuccess) return <div>Loading...</div>;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // 새 댓글 추가
    const newCommentParams: NewCommentParams = {
      postId: problemId,
      content: newComment,
    };
    setNewComment('');
    createNewComment(newCommentParams);
  };

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    if (replyingTo == null) return;

    // 새 답글 추가
    const newReply: NewReplyParams = {
      parentId: replyingTo,
      content: replyContent,
    };

    createNewReply(newReply);
    setReplyContent('');
    setReplyingTo(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {comments.map(comment => {
          if (!comment || !comment.author) return null;

          return (
            <div key={comment.id} className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={comment.author.profileImage ?? '/placeholder.svg'}
                        alt={comment.author.username}
                      />
                      <AvatarFallback>{comment.author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.author.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt?.toLocaleDateString?.()}
                        </span>
                      </div>
                      <MarkdownViewer content={comment.content} className="text-sm" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-4 py-2 border-t flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => toggleLikeComment(comment.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes.length}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>답글</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Flag className="h-4 w-4" />
                    <span>신고</span>
                  </Button>
                </CardFooter>
              </Card>

              {/* 대댓글 목록 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 space-y-3">
                  {comment.replies.map(reply => (
                    <Card key={reply.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={reply.author.profileImage || '/placeholder.svg'}
                              alt={reply.author.username}
                            />
                            <AvatarFallback>{reply.author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{reply.author.username}</span>
                              <span className="text-xs text-muted-foreground">
                                {reply.createdAt?.toLocaleDateString?.()}
                              </span>
                            </div>
                            <MarkdownViewer content={reply.content} className="text-sm" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-4 py-2 border-t flex justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => toggleLikeComment(reply.id)}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{reply.likes.length}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Flag className="h-4 w-4" />
                          <span>신고</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {/* 답글 작성 폼 */}
              {hasReply !== false && replyingTo === comment.id && (
                <div className="ml-12 mt-2">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{comment.author.username}님에게 답글 작성</span>
                      </div>
                      <MarkdownEditor
                        value={replyContent}
                        onChange={setReplyContent}
                        placeholder="답글을 작성해주세요..."
                        height={150}
                        preview="edit"
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSubmitReply}
                          disabled={!replyContent.trim()}
                          className="bg-teal-500 hover:bg-teal-600 transition-colors"
                        >
                          답글 등록
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasNewComment && (
        <form onSubmit={handleSubmitComment} className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">답변 작성</h3>
            <MarkdownEditor
              value={newComment}
              onChange={setNewComment}
              placeholder="답변을 작성해주세요..."
              height={200}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-teal-500 hover:bg-teal-600 transition-colors"
              >
                답변 등록
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
