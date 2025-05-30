import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewCause } from "../utils/endpoints/causesEndpoints";

interface CreateCauseParams {
  name: string;
  description: string;
  icon?: string;
}

export const useCreateCause = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, description, icon }: CreateCauseParams) =>
      createNewCause(name, description, icon),
    onSuccess: () => {
      // Invalidate the causes list to ensure it includes the new cause
      queryClient.invalidateQueries({ queryKey: ["causes"] });
    },
    onError: (error) => {
      console.error("Error creating cause:", error);
    },
  });
};
