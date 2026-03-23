import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { MiniApp, InsertMiniApp, MiniAppResult, InsertMiniAppResult } from "@shared/schema";

export function useMiniApps(agentId: string) {
  return useQuery<MiniApp[]>({
    queryKey: ["/api/mini-apps", agentId],
    enabled: !!agentId,
  });
}

export function useCreateMiniApp() {
  return useMutation({
    mutationFn: async (data: InsertMiniApp) => {
      const response = await apiRequest("POST", `/api/mini-apps/${data.agentId}`, data);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/mini-apps", variables.agentId] });
    },
  });
}

export function useUpdateMiniApp() {
  return useMutation({
    mutationFn: async ({ id, agentId, data }: { id: string; agentId: string; data: Partial<InsertMiniApp> }) => {
      const response = await apiRequest("PATCH", `/api/mini-app/${id}`, data);
      return { result: await response.json(), agentId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/mini-apps", data.agentId] });
    },
  });
}

export function useDeleteMiniApp() {
  return useMutation({
    mutationFn: async ({ id, agentId }: { id: string; agentId: string }) => {
      await apiRequest("DELETE", `/api/mini-app/${id}`);
      return { agentId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/mini-apps", data.agentId] });
    },
  });
}

export function useMiniAppResults(miniAppId: string) {
  return useQuery<MiniAppResult[]>({
    queryKey: ["/api/mini-app-results", miniAppId],
    enabled: !!miniAppId,
  });
}

export function useCreateMiniAppResult() {
  return useMutation({
    mutationFn: async (data: InsertMiniAppResult) => {
      const response = await apiRequest("POST", `/api/mini-app-results/${data.miniAppId}`, data);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/mini-app-results", variables.miniAppId] });
    },
  });
}

export function useRunAIMiniApp() {
  return useMutation({
    mutationFn: async ({ id, agentId, extraParams }: { id: string; agentId: string; extraParams?: Record<string, any> }) => {
      const response = await apiRequest("POST", `/api/mini-app/${id}/run`, extraParams || {});
      return { data: await response.json(), agentId, miniAppId: id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/mini-app-results", result.miniAppId] });
    },
  });
}
