import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Integration, InsertIntegration } from "@shared/schema";

export function useIntegrations(agentId: string) {
  return useQuery<Integration[]>({
    queryKey: ["/api/integrations", agentId],
    enabled: !!agentId,
  });
}

export function useCreateIntegration() {
  return useMutation({
    mutationFn: async (data: InsertIntegration) => {
      const response = await apiRequest("POST", "/api/integrations", data);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations", variables.agentId] });
    },
  });
}

export function useUpdateIntegration() {
  return useMutation({
    mutationFn: async ({ id, data, agentId }: { id: string; data: Partial<InsertIntegration>; agentId: string }) => {
      const response = await apiRequest("PATCH", `/api/integrations/${id}`, data);
      const result = await response.json();
      return { ...result, agentId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations", variables.agentId] });
    },
  });
}

export function useDeleteIntegration() {
  return useMutation({
    mutationFn: async ({ id, agentId }: { id: string; agentId: string }) => {
      await apiRequest("DELETE", `/api/integrations/${id}`);
      return { agentId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations", data.agentId] });
    },
  });
}
