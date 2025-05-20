import { Link, useNavigate, useParams } from 'react-router';
import { useProblemDetailQuery } from './useProblemDetailQuery';
import { useEffect, useState } from 'react';
import { CircleSpinner } from '../spinner';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { MarkdownEditor } from '../markdown-editor';
import { FileUpload } from '../file-upload';
import { TagInput } from '../tag-input';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import { PROBLEM_CATEGORY_OPTIONS, PROBLEM_CATEGORY_VALUES } from '@/config/options';
import { useFileDownload } from '@/hooks/useDownload';
import { strIdSchema } from '@/lib/validations/common';
import { ResAttachment } from '@/types/common';
import { Controller, useForm } from 'react-hook-form';
import { newProblemFormSchema } from '@/lib/validations/problems';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewProblemForm } from '@/lib/validations/problems';
import { API_PATH_SEGMENTS, API_PATHS } from '@/lib/api/api-paths';
import { downloadProblemAttachment, getProblem, updateProblem } from '@/lib/api/problem';
import { toast } from 'sonner';
import { ROUTE_SEGMENT } from '@/lib/router/routes';
import { ROUTES } from '@/lib/router/routes';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { LoadingBox } from '../loading-box';
import { kyInstance } from '@/lib/kyInstance';

const suggestedTags = [
  '미분방정식',
  '선형대수',
  '확률론',
  '통계학',
  '해석학',
  '대수학',
  '기하학',
  '위상수학',
  '이산수학',
  '수치해석',
  '양자역학',
  '전자기학',
  '열역학',
  '유체역학',
  '광학',
  '상대성이론',
  '입자물리학',
  '천체물리학',
  '유기화학',
  '무기화학',
  '물리화학',
  '분석화학',
  '생화학',
  '고분자화학',
  '알고리즘',
  '자료구조',
  '운영체제',
  '컴퓨터네트워크',
  '데이터베이스',
  '인공지능',
  '기계학습',
  '컴퓨터비전',
  '자연어처리',
  '웹개발',
  '모바일개발',
];

export default function EditProblemPage() {
  const navigate = useNavigate();
  const params = useParams();
  const problemId = strIdSchema.parse(params.id);
  const { downloadFile, isDownloading } = useFileDownload();

  const [existingAttachments, setExistingAttachments] = useState<ResAttachment[]>([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<ResAttachment[]>([]);

  const form = useForm<NewProblemForm>({
    resolver: zodResolver(newProblemFormSchema),
    defaultValues: {
      title: '',
      content: '',
      category: PROBLEM_CATEGORY_VALUES[0],
      tags: [],
      files: [],
    },
  });

  const { data: problemData, isLoading } = useQuery({
    queryKey: [API_PATHS.POSTS.DETAIL, problemId],
    queryFn: () => getProblem(problemId),
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: async (data: NewProblemForm) => {
      const response = updateProblem(problemId, data);

      for (const file of attachmentsToDelete) {
        await kyInstance.delete(
          API_PATHS.POSTS.REMOVE_ATTACHMENT.replace(API_PATH_SEGMENTS.DYNAMIC_ID, problemId).replace(
            API_PATH_SEGMENTS.DYNAMIC_FILENAME,
            file.filename,
          ),
        );
      }

      return response;
    },
    onSuccess: () => {
      toast.success('게시글이 수정되었습니다.');
      navigate(ROUTES.PROBLEMS.DETAIL.replace(ROUTE_SEGMENT.ID, problemId));
      queryClient.invalidateQueries({ queryKey: [API_PATHS.POSTS.DETAIL, problemId] });
    },
    onError: error => {
      console.error('게시글 수정에 실패했습니다.', error);
      toast.error('게시글 수정에 실패했습니다.');
    },
  });

  const onSubmit = (data: NewProblemForm) => {
    update(data);
  };

  const handleDownload = (file: ResAttachment) => {
    try {
      downloadFile(downloadProblemAttachment(file.filename), file.originalname);
    } catch (error) {
      console.error(error);
      toast.error('첨부 파일을 다운로드 하는 중 오류가 발생했습니다.');
    }
  };

  const handleMarkFileForDeletion = (file: ResAttachment) => {
    setAttachmentsToDelete(prev => [...prev, file]);
    setExistingAttachments(prev => prev.filter(f => f.filename !== file.filename));
  };

  useEffect(() => {
    if (problemData?.data) {
      setExistingAttachments(problemData.data.attachments || []);
      form.reset({
        title: problemData.data.title,
        content: problemData.data.content,
        category: problemData.data.categories[0] as (typeof PROBLEM_CATEGORY_VALUES)[number],
        tags: problemData.data.tags,
        files: [],
      });
    }
  }, [problemData, form]);

  if (isLoading) return <LoadingBox />;
  if (!problemData?.data)
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">문제를 찾을 수 없습니다.</div>
    );

  return (
    <main className="flex-1 container py-8 px-4 md:px-8 max-w-full mx-auto">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div className="flex items-center">
          <Link
            to={ROUTES.PROBLEMS.DETAIL.replace(ROUTE_SEGMENT.ID, problemId)}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            문제로 돌아가기
          </Link>
        </div>

        <Card className="w-full border-none shadow-lg dark:shadow-gray-800/30">
          <CardHeader>
            <CardTitle className="text-2xl">문제 수정</CardTitle>
            <CardDescription>문제 내용을 수정하고 저장하세요</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input {...form.register('title')} placeholder="문제 제목을 입력하세요" className="h-11" />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROBLEM_CATEGORY_OPTIONS.map(option => (
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
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="content" className="text-base font-medium">
                    문제 내용
                  </Label>
                  <span className="text-xs text-muted-foreground">마크다운/LaTeX 지원</span>
                </div>
                <div className="container">
                  <Controller
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <MarkdownEditor
                        value={field.value}
                        onChange={value => field.onChange(value || '')}
                        placeholder="문제의 내용을 자세히 설명해주세요. 마크다운과 LaTeX 문법을 사용할 수 있습니다. (예: $$E=mc^2$$)"
                        height={300}
                      />
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

            <CardFooter className="flex justify-between pt-6 mt-4">
              <Button variant="outline" type="button" asChild>
                <Link to={ROUTES.PROBLEMS.DETAIL.replace(ROUTE_SEGMENT.ID, problemId)}>취소</Link>
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
