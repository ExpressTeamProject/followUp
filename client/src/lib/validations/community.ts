import { z } from 'zod';
import { ARTICLE_CATEGORY_VALUES } from '@/config/options';
import { searchSchema, limitSchema, pageSchema, tagsSchema, categorySchema } from './common';

export const communityFilterSchema = z.object({
  search: searchSchema,
  category: categorySchema,
  tags: tagsSchema,
  page: pageSchema,
  limit: limitSchema,
});

export type CommunityFilterParams = z.infer<typeof communityFilterSchema>;

export const articleFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  category: z.enum(ARTICLE_CATEGORY_VALUES, {
    message: '카테고리를 선택해주세요.',
  }),
  content: z.string().min(1, '내용을 입력해주세요.'),
  tags: z.array(z.string()).max(5, '최대 5개의 태그를 입력할 수 있습니다.').optional(),
  files: z.array(z.instanceof(File)).max(3, '최대 3개의 파일을 첨부할 수 있습니다.').optional(),
});

export type ArticleForm = z.infer<typeof articleFormSchema>;
