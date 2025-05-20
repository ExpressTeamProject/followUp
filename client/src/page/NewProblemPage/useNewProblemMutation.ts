import { kyInstance } from '@/lib/kyInstance';
import { Problem } from '@/models/Problem';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export type NewProblemParams = Pick<Problem, 'title' | 'content' | 'categories' | 'tags'> & {
  files: Problem['attachments'];
}

function useNewProblemMutation() {
  const [formData, setFormData] = useState<NewProblemParams>({
    title: "",
    categories: [],
    content: "",
    tags: [],
    files: [],
  });

  return {
    ...useMutation({
      mutationFn: async (data: NewProblemParams) => {
        const response = await kyInstance.post('posts', { json: data });
        return response.json();
      },
    }),
    formData,
    setFormData,
  };
}


export default useNewProblemMutation
