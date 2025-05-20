import { z } from 'zod';

export const editMyProfileSchema = z.object({
  profileImage: z.string().optional(),
  username: z.string().min(1),
  nickname: z.string().min(1),
  email: z.string().email(),
  bio: z.string().optional(),
  major: z.string().optional(),
  website: z.string().optional(),
  socialLinks: z
    .object({
      github: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),
});

export type EditMyProfileSchema = z.infer<typeof editMyProfileSchema>;
