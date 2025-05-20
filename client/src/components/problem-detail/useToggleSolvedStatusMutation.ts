import { kyInstance } from '@/lib/kyInstance';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { RestApiResponse } from '@/models/ApiCommon';
import { Problem } from '@/models/Problem';
import { useMutation } from '@tanstack/react-query';

function useToggleSolvedStatusMutation(problemId: string) {
  return useMutation({
    mutationFn: async () => {
      const response = await kyInstance.put(`posts/${problemId}/toggle-status`);
      return response.json() as Promise<RestApiResponse<Problem>>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problem', problemId] });
    },
  });
}

export default useToggleSolvedStatusMutation;
