import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Toolbox, InsertToolbox } from "@shared/schema";

function invalidateHierarchy() {
  queryClient.invalidateQueries({ queryKey: ["/api/series"] });
  queryClient.invalidateQueries({ queryKey: ["/api/big-ideas"] });
  queryClient.invalidateQueries({ queryKey: ["/api/big-ideas/active"] });
  queryClient.invalidateQueries({ queryKey: ["/api/toolboxes"] });
  queryClient.invalidateQueries({ queryKey: ["/api/toolboxes/active"] });
  queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
  queryClient.invalidateQueries({ queryKey: ["/api/agents/active"] });
  queryClient.invalidateQueries({ queryKey: ["/api/context/active"] });
}

export function useToolboxes(bigIdeaId?: number | string) {
  const queryKey = bigIdeaId 
    ? ["/api/toolboxes", { bigIdeaId: String(bigIdeaId) }]
    : ["/api/toolboxes"];
  
  return useQuery<Toolbox[]>({
    queryKey,
    queryFn: async () => {
      const url = bigIdeaId 
        ? `/api/toolboxes?bigIdeaId=${bigIdeaId}` 
        : "/api/toolboxes";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch toolboxes");
      return res.json();
    },
  });
}

export function useActiveToolbox() {
  return useQuery<Toolbox | null>({
    queryKey: ["/api/toolboxes/active"],
  });
}

export function useToolbox(id: string) {
  return useQuery<Toolbox>({
    queryKey: ["/api/toolboxes", id],
    enabled: !!id,
  });
}

export function useCreateToolbox() {
  return useMutation({
    mutationFn: async (data: InsertToolbox) => {
      const res = await apiRequest("POST", "/api/toolboxes", data);
      return res.json();
    },
    onSuccess: () => {
      invalidateHierarchy();
    },
  });
}

export function useUpdateToolbox() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertToolbox> }) => {
      const res = await apiRequest("PATCH", `/api/toolboxes/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      invalidateHierarchy();
    },
  });
}

export function useActivateToolbox() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/toolboxes/${id}/activate`);
      return res.json();
    },
    onSuccess: () => {
      invalidateHierarchy();
    },
  });
}

export function useDeleteToolbox() {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/toolboxes/${id}`);
    },
    onSuccess: () => {
      invalidateHierarchy();
    },
  });
}
