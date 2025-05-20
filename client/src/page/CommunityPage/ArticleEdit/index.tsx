import { LoadingBox } from '@/components/loading-box';
import { API_PATH_SEGMENTS, API_PATHS } from '@/lib/api/api-paths';
import { getArticle, updateArticle } from '@/lib/api/community';
import { strIdSchema } from '@/lib/validations/common';
import { articleFormSchema } from '@/lib/validations/community';
import { ArticleForm } from '@/lib/validations/community';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { FileUpload } from '@/components/file-upload';
import { MarkdownEditor } from '@/components/markdown-editor';
import { TagInput } from '@/components/tag-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { ROUTE_SEGMENT, ROUTES } from '@/lib/router/routes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ARTICLE_CATEGORY_OPTIONS, ARTICLE_CATEGORY_VALUES } from '@/config/options';
import { ResAttachment } from '@/types/common';
import { downloadArticleAttachment } from '@/lib/api/community';
import { kyInstance } from '@/lib/kyInstance';
import { useFileDownload } from '@/hooks/useDownload';
import { toast } from 'sonner';

const suggestedTags = [
  '수학',
  '물리학',
  '화학',
  '생물학',
  '컴퓨터과학',
  '프로그래밍',
  '알고리즘',
  '자료구조',
  '인공지능',
  '머신러닝',
  '딥러닝',
  '웹개발',
  '모바일개발',
  '데이터베이스',
  '네트워크',
  '운영체제',
  '보안',
  '클라우드',
  '블록체인',
  '게임개발',
  '그래픽스',
  'UI/UX',
  '디자인패턴',
];

export default function ArticleEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const articleId = strIdSchema.parse(params.id);
  const { downloadFile, isDownloading } = useFileDownload();

  const [existingAttachments, setExistingAttachments] = useState<ResAttachment[]>([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<ResAttachment[]>([]);

  const form = useForm<ArticleForm>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: '',
      content: '',
      category: ARTICLE_CATEGORY_VALUES[0],
      tags: [],
      files: [],
    },
  });

  const { data: articleData, isLoading } = useQuery({
    queryKey: [API_PATHS.ARTICLES.DETAIL, articleId],
    queryFn: () => getArticle(articleId),
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: async (data: ArticleForm) => {
      const response = await updateArticle(articleId, data);

      for (const file of attachmentsToDelete) {
        await kyInstance.delete(
          API_PATHS.ARTICLES.REMOVE_ATTACHMENT.replace(API_PATH_SEGMENTS.DYNAMIC_ID, articleId).replace(
            API_PATH_SEGMENTS.DYNAMIC_FILENAME,
            file.filename,
          ),
        );
      }

      return response;
    },
    onSuccess: () => {
      toast.success('게시글이 수정되었습니다.');
      navigate(ROUTES.COMMUNITY.DETAIL.replace(ROUTE_SEGMENT.ID, articleId));
      queryClient.invalidateQueries({ queryKey: [API_PATHS.ARTICLES.DETAIL, articleId] });
    },
    onError: error => {
      console.error('게시글 수정에 실패했습니다.', error);
      toast.error('게시글 수정에 실패했습니다.');
    },
  });

  const onSubmit = (formValues: ArticleForm) => {
    update(formValues);
  };

  useEffect(() => {
    if (articleData?.data) {
      setExistingAttachments(articleData.data.attachments || []);
      form.reset({
        title: articleData.data.title,
        content: articleData.data.content,
        category: articleData.data.category as (typeof ARTICLE_CATEGORY_OPTIONS)[number]['value'],
        tags: articleData.data.tags,
        files: [],
      });
    }
  }, [articleData, form]);

  const handleDownload = (file: ResAttachment) => {
    try {
      downloadFile(downloadArticleAttachment(file.filename), file.originalname);
    } catch (error) {
      console.error(error);
      toast.error('첨부 파일을 다운로드 하는 중 오류가 발생했습니다.');
    }
  };

  const handleMarkFileForDeletion = (file: ResAttachment) => {
    setAttachmentsToDelete(prev => [...prev, file]);
    setExistingAttachments(prev => prev.filter(f => f.filename !== file.filename));
  };

  if (isLoading) return <LoadingBox />;
  if (!articleData?.data)
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">게시글을 찾을 수 없습니다.</div>
    );

  return (
    <main className="flex-1 container py-8 px-4 md:px-8 max-w-full mx-auto">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div className="flex items-center">
          <Link
            to={ROUTES.COMMUNITY.DETAIL.replace(ROUTE_SEGMENT.ID, articleId)}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            게시글로 돌아가기
          </Link>
        </div>

        <Card className="w-full border-none shadow-lg dark:shadow-gray-800/30">
          <CardHeader>
            <CardTitle className="text-2xl">게시글 수정</CardTitle>
            <CardDescription>게시글 내용을 수정하고 저장하세요</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input {...form.register('title')} placeholder="게시글 제목을 입력하세요" className="h-11" />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {ARTICLE_CATEGORY_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.category && (
                  <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">내용</Label>
                <div className="container">
                  <Controller
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                      <MarkdownEditor value={field.value} onChange={value => field.onChange(value || '')} />
                    )}
                  />
                </div>
                {form.formState.errors.content && (
                  <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">첨부 파일</Label>
                {existingAttachments.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">기존 첨부 파일</p>
                    {existingAttachments.map(file => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                      >
                        <span className="truncate flex-1">{file.originalname}</span>
                        <div className="flex gap-2">
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                            {isDownloading ? '다운로드 중...' : '다운로드'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkFileForDeletion(file)}
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {attachmentsToDelete.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-muted-foreground">삭제 예정 파일</p>
                    {attachmentsToDelete.map(file => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 bg-gray-50/50 dark:bg-gray-800/50 rounded-md text-muted-foreground"
                      >
                        <span className="truncate flex-1 line-through">{file.originalname}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAttachmentsToDelete(prev => prev.filter(f => f.filename !== file.filename));
                            setExistingAttachments(prev => [...prev, file]);
                          }}
                        >
                          복구
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <Controller
                  name="files"
                  control={form.control}
                  render={({ field }) => (
                    <FileUpload
                      accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                      maxSize={5}
                      maxFiles={3 - existingAttachments.length}
                      value={field.value || []}
                      onUpload={files => field.onChange(files)}
                      onRemove={(file: File) => {
                        const newFiles = (field.value || []).filter(f => f !== file);
                        field.onChange(newFiles);
                      }}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  이미지, PDF, 문서 파일을 첨부할 수 있습니다. 최대 3개, 각 파일당 최대 5MB까지 가능합니다.
                </p>
                {form.formState.errors.files && (
                  <p className="text-sm text-red-500">{form.formState.errors.files.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">태그</Label>
                <Controller
                  name="tags"
                  control={form.control}
                  render={({ field }) => (
                    <TagInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="태그를 입력하세요 (Enter로 추가)"
                      suggestions={suggestedTags}
                      maxTags={5}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  최대 5개의 태그를 추가할 수 있습니다. 관련 태그를 추가하면 더 많은 사용자에게 글이 노출됩니다.
                </p>
                {form.formState.errors.tags && (
                  <p className="text-sm text-red-500">{form.formState.errors.tags.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="mt-4 flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link to={ROUTES.COMMUNITY.DETAIL.replace(ROUTE_SEGMENT.ID, articleId)}>취소</Link>
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600 transition-colors" disabled={isUpdating}>
                {isUpdating ? '수정 중...' : '글 수정'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
