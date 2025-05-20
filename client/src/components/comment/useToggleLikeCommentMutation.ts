import { kyInstance } from '@/lib/kyInstance';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { RestApiResponse } from '@/models/ApiCommon';
import { Comment } from '@/models/Comment';
import { useMutation } from '@tanstack/react-query';

async function toggleLikeComment(commentId: string) {
  const response = (await kyInstance.put(`comments/${commentId}/like`, { json: {} })).json();
  const data = (await response) as RestApiResponse<Comment>;
  return data.data;
}

function useToggleLikeCommentMutation() {
  return useMutation({
    mutationFn: toggleLikeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentByProblemId'] });
    },
  });
}

export default useToggleLikeCommentMutation;
