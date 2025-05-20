import { kyInstance } from '@/lib/kyInstance';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

function useDeleteProblemMutation(problemId: string) {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => kyInstance.delete(`posts/${problemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problem', problemId] });
      navigate('/problems');
    },
    onError: error => {
      console.log('error', error);
    },
  });
}

export default useDeleteProblemMutation;
