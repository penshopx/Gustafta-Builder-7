import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { KnowledgeBase, InsertKnowledgeBase } from "@shared/schema";

export function useKnowledgeBases(agentId: string) {
  return useQuery<KnowledgeBase[]>({
    queryKey: ["/api/knowledge-base", agentId],
    enabled: !!agentId,
  });
}

export function useCreateKnowledgeBase() {
  return useMutation({
    mutationFn: async (data: InsertKnowledgeBase) => {
      const response = await apiRequest("POST", "/api/knowledge-base", data);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/knowledge-base", variables.agentId] });
    },
  });
}

export function useUploadKnowledgeFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/knowledge-base/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Failed to upload file");
      return res.json();
    },
  });
}

export function useDeleteKnowledgeBase() {
  return useMutation({
    mutationFn: async ({ id, agentId }: { id: string; agentId: string }) => {
      await apiRequest("DELETE", `/api/knowledge-base/${id}`);
      return { agentId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/knowledge-base", data.agentId] });
    },
  });
}
