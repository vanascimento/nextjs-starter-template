import { register } from "@/app/actions/register";
import { RegisterSchema } from "@/schemas/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export const useCreateAccount = () => {
  const mutation = useMutation<
    { message: string },
    Error,
    z.infer<typeof RegisterSchema>
  >({
    onSuccess: () => {
      toast.success("Account created");
    },
    onError: (error) => {
      toast.error(error.message);
      return Promise.reject(error);
    },
    mutationFn: async (values) => {
      const response = await register(values);
      if (response.success) {
        return { message: response.success };
      }
      throw new Error(response.error);
    },
  });

  return mutation;
};
