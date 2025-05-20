import { Problem } from '@/models/Problem';
import { kyInstance } from '../kyInstance';
import { API_PATH_SEGMENTS } from './api-paths';
import { API_PATHS } from './api-paths';
import { NewProblemForm, ProblemFilterParams } from '@/lib/validations/problems';
import { ResApiWithPagination, ResApiWithData } from '@/types/common';

export const getProblem = async (problemId: string) => {
  const response = await kyInstance.get<ResApiWithData<Problem>>(
    API_PATHS.POSTS.DETAIL.replace(API_PATH_SEGMENTS.DYNAMIC_ID, problemId),
  );

  return response.json();
};

export const createProblem = async (formValues: NewProblemForm) => {
  const json = {
    title: formValues.title,
    categories: [formValues.category],
    content: formValues.content,
    tags: formValues.tags?.join(',') || '',
  };

  const response = await kyInstance
    .post<ResApiWithData<Problem>>(API_PATHS.POSTS.CREATE, {
      json,
    })
    .then(res => res.json());

  const problem = response.data;

  if (formValues.files && formValues.files.length > 0) {
    await addProblemAttachment(problem.id, formValues.files);
  }

  return problem;
};

export const updateProblem = async (problemId: string, formValues: NewProblemForm) => {
  const json = {
    title: formValues.title,
    categories: [formValues.category],
    content: formValues.content,
    tags: formValues.tags?.join(',') || '',
  };

  const response = await kyInstance.put(API_PATHS.POSTS.UPDATE.replace(API_PATH_SEGMENTS.DYNAMIC_ID, problemId), {
    json,
  });

  if (formValues.files && formValues.files.length > 0) {
    await addProblemAttachment(problemId, formValues.files);
  }

  return response.json();
};

export const addProblemAttachment = async (problemId: string, files: File[]) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append(`files`, file);
  });

  const response = await kyInstance.post(
    API_PATHS.POSTS.ADD_ATTACHMENTS.replace(API_PATH_SEGMENTS.DYNAMIC_ID, problemId),
    {
      body: formData,
    },
  );

  return response.json();
};

export const removeProblemAttachment = async (problemId: string, filename: string) => {
  const response = await kyInstance.delete(
    API_PATHS.POSTS.REMOVE_ATTACHMENT.replace(API_PATH_SEGMENTS.DYNAMIC_ID, problemId).replace(
      API_PATH_SEGMENTS.DYNAMIC_FILENAME,
      filename,
    ),
  );

  return response.json();
};

export const getProblemsByUser = async (userId: string, params?: ProblemFilterParams) => {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.status) searchParams.set('status', params.status);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.tags) searchParams.set('tags', params.tags.join(','));
  if (params?.sort) searchParams.set('sort', params.sort);

  const response = await kyInstance.get<ResApiWithPagination<Problem[], ProblemFilterParams>>(
    API_PATHS.POSTS.BY_USER.replace(API_PATH_SEGMENTS.DYNAMIC_ID, userId),
    {
      searchParams,
    },
  );

  return response.json();
};

export const downloadProblemAttachment = async (filename: string) => {
  const response = await kyInstance.get(
    API_PATHS.DOWNLOAD.POST_ATTACHMENT.replace(API_PATH_SEGMENTS.DYNAMIC_FILENAME, filename),
  );

  return response.blob();
};
