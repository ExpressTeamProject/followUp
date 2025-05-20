import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { MarkdownEditor } from '@/components/markdown-editor';
import { TagInput } from '@/components/tag-input';
import { FileUpload } from '@/components/file-upload';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newProblemFormSchema, NewProblemForm } from '@/lib/validations/problems';
import { PROBLEM_CATEGORY_OPTIONS, PROBLEM_CATEGORY_VALUES, PROBLEM_SUGGESTED_TAGS } from '@/config/options';
import { useMutation } from '@tanstack/react-query';
import { createProblem } from '@/lib/api/problem';
import { ROUTES } from '@/lib/router/routes';
import { toast } from 'sonner';
import { VoiceInputButton } from '../VoiceInputButton';

export default function NewProblemPage() {
  const navigate = useNavigate();
  const form = useForm<NewProblemForm>({
    resolver: zodResolver(newProblemFormSchema),
    defaultValues: {
      title: '',
      category: PROBLEM_CATEGORY_VALUES[0],
      content: '',
      tags: [],
      files: [],
    },
  });

  const { mutate: create, isPending } = useMutation({
    mutationFn: (formValues: NewProblemForm) => createProblem(formValues),
    onSuccess: () => {
      navigate(ROUTES.PROBLEMS.LIST);
      toast.success('문제가 성공적으로 등록되었습니다.');
    },
    onError: error => {
      console.error('Failed to submit form:', error);
      toast.error('문제 등록에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const onSubmit = (formValues: NewProblemForm) => {
    create(formValues);
  };

  const handleTranscriptReceived = (transcript: string) => {
    form.setValue('content', transcript);
  };

  return (
    <main className="flex-1 container py-8 px-4 md:px-8 max-w-full mx-auto">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div className="flex items-center">
          <Link to={ROUTES.PROBLEMS.LIST} className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            문제 목록으로 돌아가기
          </Link>
        </div>

        <Card className="w-full border-none shadow-lg dark:shadow-gray-800/30">
          <CardHeader>
            <CardTitle className="text-2xl">새 문제 등록</CardTitle>
            <CardDescription>전공 관련 문제를 등록하고 다른 사용자들과 함께 해결해보세요</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input id="title" {...form.register('title')} placeholder="문제의 제목을 입력하세요" />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                  <div className="flex items-center gap-3">
                    <VoiceInputButton onTranscriptReceived={handleTranscriptReceived} />
                  </div>
                </div>

                <div className="container">
                  <Controller
                    name="content"
                    control={form.control}
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
                <Controller
                  name="files"
                  control={form.control}
                  render={({ field }) => (
                    <FileUpload
                      accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                      maxSize={5}
                      maxFiles={3}
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
                      suggestions={PROBLEM_SUGGESTED_TAGS}
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
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link to={ROUTES.PROBLEMS.LIST}>취소</Link>
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600 transition-colors" disabled={isPending}>
                {isPending ? '등록 중...' : '문제 등록'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
