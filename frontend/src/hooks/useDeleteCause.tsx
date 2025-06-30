import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCause } from "../utils/endpoints/causesEndpoints";

interface DeleteCauseParams {
  id: number;
}

export const useDeleteCause = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteCauseParams) => deleteCause(id),
    onSuccess: (_, variables) => {
      // Invalidate the specific cause query
      queryClient.invalidateQueries({
        queryKey: ["cause", variables.id.toString()],
      });

      // Remove the specific cause from the cache
      queryClient.removeQueries({
        queryKey: ["cause", variables.id.toString()],
      });

      // Invalidate the causes list to ensure it's updated
      queryClient.invalidateQueries({ queryKey: ["causes"] });
    },
    onError: (error) => {
      console.error("Error deleting cause:", error);
    },
  });
};
