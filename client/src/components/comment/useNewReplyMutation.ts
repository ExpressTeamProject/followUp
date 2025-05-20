import { kyInstance } from '@/lib/kyInstance';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { RestApiResponse } from '@/models/ApiCommon';
import { Comment } from '@/models/Comment';
import { useMutation } from '@tanstack/react-query';

export interface NewReplyParams {
  parentId: string;
  content: string;
}

async function createNewReply(comment: NewReplyParams) {
  const response = (
    await kyInstance.post(`comments/reply/${comment.parentId}`, { json: { content: comment.content } })
  ).json();
  const data = (await response) as RestApiResponse<Comment>;
  return data.data;
}

function useNewReplyMutation() {
  return useMutation({
    mutationFn: (comment: NewReplyParams) => createNewReply(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentByProblemId'] });
    },
  });
}

export default useNewReplyMutation;
