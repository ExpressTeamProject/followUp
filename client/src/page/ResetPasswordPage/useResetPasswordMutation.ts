import { kyInstance } from "@/lib/kyInstance";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export interface ResetPasswordParams {
  newPassword: string;
  confirmPassword: string;
}

function useResetPasswordMutation() {
  const [formData, setFormData] = useState<ResetPasswordParams>({
    newPassword: '',
    confirmPassword: '',
  });

  return (
    {
      ...useMutation({
        mutationFn: async (data: ResetPasswordParams) => {
          const response = await kyInstance.put(`auth/updatepassword`, { json: data });
          return response.json();
        },
      })
      , formData, setFormData
    })
}

export default useResetPasswordMutation
