import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCause } from "../utils/endpoints/causesEndpoints";

interface UpdateCauseParams {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export const useUpdateCause = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name, description, icon }: UpdateCauseParams) =>
      updateCause(id, name, description, icon),
    onSuccess: (updatedCause, variables) => {
      // Invalidate and refetch the specific cause query
      queryClient.invalidateQueries({ queryKey: ["cause", variables.id] });

      // Update the cache directly for immediate UI update
      queryClient.setQueryData(["cause", variables.id], updatedCause);

      // Invalidate the causes list to ensure it's also updated
      queryClient.invalidateQueries({ queryKey: ["causes"] });
    },
    onError: (error) => {
      console.error("Error updating cause:", error);
    },
  });
};
