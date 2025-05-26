import { useState, useEffect } from "react";
import Cause from "../interfaces/Cause";
import { getCauseById } from "../utils/endpoints/causesEndpoints";

export const useCauseById = (causeId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCause, setCurrentCause] = useState<Cause | null>(null);

  useEffect(() => {
    const fetchCause = async () => {
      if (!causeId) return;

      try {
        setIsLoading(true);
        const response = await getCauseById(causeId);
        setCurrentCause(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCause();
  }, [causeId]);

  return { isLoading, error, currentCause };
};
