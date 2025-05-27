import { useQuery } from "@tanstack/react-query";
import { getCauses } from "../utils/endpoints/causesEndpoints";

export const useGetCauses = () => {
  return useQuery({
    queryKey: ["causes"],
    queryFn: getCauses,
  });
};
