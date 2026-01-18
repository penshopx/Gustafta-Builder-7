import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { UserProfile, InsertUserProfile } from "@shared/schema";

const DEFAULT_USER_ID = "default-user";

export function useProfile() {
  return useQuery<UserProfile | null>({
    queryKey: ["/api/profile", DEFAULT_USER_ID],
    queryFn: async () => {
      const res = await fetch(`/api/profile/${DEFAULT_USER_ID}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
  });
}

export function useSaveProfile() {
  return useMutation({
    mutationFn: async (data: Omit<InsertUserProfile, "userId">) => {
      const res = await apiRequest("POST", "/api/profile", {
        ...data,
        userId: DEFAULT_USER_ID,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
  });
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Failed to upload avatar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
  });
}
