import { kyInstance } from '@/lib/kyInstance';
import { ResAuthUser } from '@/types/common';
import { useMutation } from '@tanstack/react-query';

interface SignUpResponse {
  success: boolean;
  data: ResAuthUser;
}

function useSignUpMutation() {
  return useMutation({
    mutationKey: ['signup'],
    mutationFn: async ({
      email,
      password,
      username,
      nickname,
    }: {
      email: string;
      password: string;
      username: string;
      nickname: string;
    }) => {
      const response = await kyInstance.post('auth/register', { json: { email, password, username, nickname } });
      return response.json() as Promise<SignUpResponse>;
    },
  });
}

export default useSignUpMutation;
