import { kyInstance } from '@/lib/kyInstance';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { RestApiResponse } from '@/models/ApiCommon';
import { Comment } from '@/models/Comment';
import { useMutation } from '@tanstack/react-query';

export interface NewCommentParams {
  postId: string;
  content: string;
}

async function createNewComment(comment: NewCommentParams) {
  const response = (await kyInstance.post(`comments`, { json: comment })).json();
  const data = (await response) as RestApiResponse<Comment>;
  return data.data;
}

function useNewCommentMutation() {
  return useMutation({
    mutationFn: (comment: NewCommentParams) => createNewComment(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentByProblemId'] });
    },
  });
}

export default useNewCommentMutation;
