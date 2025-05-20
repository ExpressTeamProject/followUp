import { ALL_VALUE, DEFAULT_PAGE_SIZE } from '@/config/constant';
import { z } from 'zod';

export const strIdSchema = z.string();
export const searchSchema = z.coerce.string().optional().catch('');
export const tagsSchema = z
  .string()
  .transform(val => val.split(','))
  .optional()
  .catch([]);
export const pageSchema = z.coerce.number().optional().catch(1).default(1);
export const limitSchema = z.coerce.number().optional().catch(DEFAULT_PAGE_SIZE).default(DEFAULT_PAGE_SIZE);
export const problemStatusSchema = z.enum(['solved', 'unsolved', ALL_VALUE]).optional().catch(ALL_VALUE);
export const categorySchema = z.string().optional().catch(ALL_VALUE);
export const sortSchema = z.enum(['-createdAt', 'popular', 'comments']).optional().catch('-createdAt');
