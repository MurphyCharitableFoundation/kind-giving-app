import { useQuery } from "@tanstack/react-query";
import { getCauseById } from "../utils/endpoints/causesEndpoints";

export const useGetCauseById = (causeId: string) => {
  const {
    isLoading,
    error,
    data: currentCause,
  } = useQuery({
    queryKey: ["cause", causeId],
    queryFn: () => getCauseById(causeId!),
    enabled: !!causeId, // Only run the query if causeId exists
  });

  return { isLoading, error, currentCause };
};
