import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Agent, InsertAgent } from "@shared/schema";

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });
}

export function useActiveAgent() {
  return useQuery<Agent | null>({
    queryKey: ["/api/agents/active"],
  });
}

export function useAgent(id: string) {
  return useQuery<Agent>({
    queryKey: ["/api/agents", id],
    enabled: !!id,
  });
}

export function useCreateAgent() {
  return useMutation({
    mutationFn: async (data: InsertAgent) => {
      const response = await apiRequest("POST", "/api/agents", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agents/active"] });
    },
  });
}

export function useUpdateAgent() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertAgent> }) => {
      const response = await apiRequest("PATCH", `/api/agents/${id}`, data);
      return await response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agents", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/agents/active"] });
    },
  });
}

export function useSetActiveAgent() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/agents/${id}/activate`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agents/active"] });
    },
  });
}

export function useDeleteAgent() {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/agents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agents/active"] });
    },
  });
}
