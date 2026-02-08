import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { BigIdea, InsertBigIdea } from "@shared/schema";

export function useBigIdeas() {
  return useQuery<BigIdea[]>({
    queryKey: ["/api/big-ideas"],
  });
}

export function useActiveBigIdea() {
  return useQuery<BigIdea | null>({
    queryKey: ["/api/big-ideas/active"],
  });
}

export function useBigIdea(id: string) {
  return useQuery<BigIdea>({
    queryKey: ["/api/big-ideas", id],
    enabled: !!id,
  });
}

export function useCreateBigIdea() {
  return useMutation({
    mutationFn: async (data: InsertBigIdea) => {
      const res = await apiRequest("POST", "/api/big-ideas", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/big-ideas"] });
    },
  });
}

export function useUpdateBigIdea() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertBigIdea> }) => {
      const res = await apiRequest("PATCH", `/api/big-ideas/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/big-ideas"] });
    },
  });
}

export function useActivateBigIdea() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/big-ideas/${id}/activate`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/big-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/big-ideas/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/toolboxes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/toolboxes/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agents/active"] });
    },
  });
}

export function useDeleteBigIdea() {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/big-ideas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/big-ideas"] });
    },
  });
}
