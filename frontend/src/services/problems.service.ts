import { useQueryClient } from "@tanstack/react-query";
import { apiService } from "./api.service";
import { useCustomQuery, useCustomMutation } from "@/hooks/use-query-hooks";

// interface ProblemCallbacks {
//   onSuccess?: () => void;
//   onError?: (error: Error) => void;
// }

export const useProblems = () => {
  const { data: problemsData, ...rest } = useCustomQuery({
    queryKey: ["problems"],
    queryFn: apiService.problems.getAll,
  });
  return { problemsData, ...rest };
};

export const useProblem = (slug: string) => {
  const { data: problemData, ...rest } = useCustomQuery({
    queryKey: ["problem", slug],
    queryFn: () => apiService.problems.get(slug),
  });
  return { problemData, ...rest };
};

export const useCreateProblem = () => {
  const queryClient = useQueryClient();

  const { mutate: createProblem, ...rest } = useCustomMutation({
    mutationFn: apiService.problems.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });

  return { createProblem, ...rest };
};

// export const useUpdateProblem = () => {
//   const { mutate: updateProblemMutation, ...rest } = useCustomMutation({
//     mutationFn: apiService.problems.update,
//   });

//   const updateProblem = (id: string, data: any, callbacks?: ProblemCallbacks) => {
//     return updateProblemMutation({ id, data }, {
//       onSuccess: () => {
//         callbacks?.onSuccess?.();
//       },
//       onError: (error) => {
//         callbacks?.onError?.(error);
//       },
//     });
//   };

//   return { updateProblem, ...rest };
// };
