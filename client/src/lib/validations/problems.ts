import { z } from 'zod';
import { categorySchema, pageSchema, sortSchema, problemStatusSchema, limitSchema, tagsSchema } from './common';
import { PROBLEM_CATEGORY_VALUES } from '@/config/options';

export const problemFilterSchema = z.object({
  status: problemStatusSchema,
  category: categorySchema,
  tags: tagsSchema,
  page: pageSchema,
  limit: limitSchema,
  sort: sortSchema,
});

export type ProblemFilterParams = z.infer<typeof problemFilterSchema>;

export const newProblemFormSchema = z.object({
  title: z.string().min(1, '제목을    입력해주세요.'),
  category: z.enum(PROBLEM_CATEGORY_VALUES, {
    message: '카테고리를 선택해주세요.',
  }),
  content: z.string().min(1, '내용을 입력해주세요.'),
  tags: z.array(z.string()).max(5, '최대 5개의 태그를 입력할 수 있습니다.').optional(),
  files: z.array(z.instanceof(File)).max(3, '최대 3개의 파일을 첨부할 수 있습니다.').optional(),
});

export type NewProblemForm = z.infer<typeof newProblemFormSchema>;
