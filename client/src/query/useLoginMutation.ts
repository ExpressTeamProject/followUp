import { kyInstance, pushTokenToHeader } from '@/lib/kyInstance';
import { ResApiWithData, ResAuthUser } from '@/types/common';
import useAuthStore from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { API_PATHS } from '@/lib/api/api-paths';
interface LoginResponse {
  token: string;
  user: ResAuthUser;
}

function useLoginMutation() {
  const { setToken, setUser } = useAuthStore();

  return useMutation({
    mutationKey: ['login'],
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      const response = kyInstance.post<ResApiWithData<LoginResponse>>(API_PATHS.AUTH.LOGIN, {
        json: { email, password },
      });

      return response.json() as Promise<LoginResponse>;
    },
    onSuccess: data => {
      setToken(data.token);
      setUser(data.user);
      pushTokenToHeader(data.token);
    },
  });
}

export default useLoginMutation;
