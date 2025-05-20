import { kyInstance } from '@/lib/kyInstance';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { RestApiResponse } from '@/models/ApiCommon';
import { Comment } from '@/models/Comment';
import { useMutation } from '@tanstack/react-query';

async function toggleLikeProblem(problemId: string) {
  const response = (await kyInstance.put(`posts/${problemId}/like`, { json: {} })).json();
  const data = (await response) as RestApiResponse<Comment>;
  return data.data;
}

function useToggleLikeProblemMutation(problemId: string) {
  return useMutation({
    mutationFn: () => toggleLikeProblem(problemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problem', problemId] });
    },
  });
}

export default useToggleLikeProblemMutation;
