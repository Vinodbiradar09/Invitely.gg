"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function useCreateWorkspace() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function createWorkspace(name: string) {
    try {
      setIsLoading(true);
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return false;
      }
      toast.success("workspace created");
      router.refresh();
      return true;
    } catch {
      toast.error("failed to create workspace");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { createWorkspace, isLoading };
}

export function useDeleteWorkspace() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function deleteWorkspace(workspaceId: string) {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/workspaces/${workspaceId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return false;
      }
      toast.success("workspace deleted");
      router.refresh();
      return true;
    } catch {
      toast.error("failed to delete workspace");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { deleteWorkspace, isLoading };
}

export function useAddMembers() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function addMembers(
    workspaceId: string,
    members: { email: string; name?: string }[],
  ) {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/workspaces/${workspaceId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(members),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return false;
      }
      toast.success(
        `${members.length} member${members.length === 1 ? "" : "s"} added`,
      );
      router.refresh();
      return true;
    } catch {
      toast.error("failed to add members");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { addMembers, isLoading };
}

export function useDeleteMember() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function deleteMember(memberId: string, workspaceId: string) {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/workspaces/${workspaceId}/members/${memberId}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return false;
      }
      toast.success("member removed");
      router.refresh();
      return true;
    } catch {
      toast.error("failed to remove member");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { deleteMember, isLoading };
}
