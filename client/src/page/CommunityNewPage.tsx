import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { TagInput } from '@/components/tag-input';
import { FileUpload } from '@/components/file-upload';
import { ARTICLE_SUGGESTED_TAGS, ARTICLE_CATEGORY_OPTIONS } from '@/config/options';
import { articleFormSchema } from '@/lib/validations/community';
import type { ArticleForm } from '@/lib/validations/community';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MarkdownEditor } from '@/components/markdown-editor';
import { ROUTES } from '@/lib/router/routes';
import { createArticle } from '@/lib/api/community';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function CommunityNewPage() {
  const navigate = useNavigate();

  const form = useForm<ArticleForm>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: '',
      category: '질문',
      content: '',
      tags: [],
      files: [],
    },
  });

  const { mutate: createNew, isPending: isSubmitting } = useMutation({
    mutationFn: (data: ArticleForm) => createArticle(data),
    onSuccess: () => {
      navigate(ROUTES.COMMUNITY.LIST);
      toast.success('게시글이 성공적으로 등록되었습니다.');
    },
    onError: error => {
      console.error('Failed to submit form:', error);
      toast.error('게시글 등록에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const onSubmit = (formValues: ArticleForm) => {
    createNew(formValues);
  };

  return (
    <main className="flex-1 container py-8 px-4 md:px-8 max-w-full mx-auto">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div className="flex items-center">
          <Link to={ROUTES.COMMUNITY.LIST} className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            커뮤니티로 돌아가기
          </Link>
        </div>
        <Card className="border-none shadow-lg dark:shadow-gray-800/30">
          <CardHeader>
            <CardTitle className="text-2xl">새 글 작성</CardTitle>
            <CardDescription>커뮤니티에 새로운 글을 작성하여 다른 사용자들과 정보를 공유하세요</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input id="title" {...form.register('title')} placeholder="글의 제목을 입력하세요" />
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
                      suggestions={ARTICLE_SUGGESTED_TAGS}
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
                <Link to={ROUTES.COMMUNITY.LIST}>취소</Link>
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600 transition-colors" disabled={isSubmitting}>
                {isSubmitting ? '등록 중...' : '글 등록'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
