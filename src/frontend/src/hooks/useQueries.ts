import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ExternalBlob } from "../backend";
import type {
  CVEntry,
  PricingPackage,
  SessionContentItem,
  TherapistProfile,
} from "../backend.d";
import { loadConfig } from "../config";
import { useActor } from "./useActor";

export function useTherapistProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<TherapistProfile>({
    queryKey: ["therapistProfile"],
    queryFn: async () => {
      if (!actor)
        return {
          name: "",
          tagline: "",
          bio: "",
          photo: new Uint8Array(),
          contactEmail: "",
          contactPhone: "",
          contactAddress: "",
        };
      return actor.getTherapistProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCVEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<CVEntry[]>({
    queryKey: ["cvEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCVEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSessionContentItems() {
  const { actor, isFetching } = useActor();
  return useQuery<SessionContentItem[]>({
    queryKey: ["sessionContentItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSessionContentItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePricingPackages() {
  const { actor, isFetching } = useActor();
  return useQuery<PricingPackage[]>({
    queryKey: ["pricingPackages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPricingPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContactFormSubmissions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contactSubmissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactFormSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSeedData() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.seedSampleData();
    },
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitContactForm(
        data.name,
        data.email,
        data.phone || null,
        data.message,
      );
    },
  });
}

export function useUpdateTherapistProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: TherapistProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateTherapistProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["therapistProfile"] }),
  });
}

export function useUpdateProfilePhoto() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (blob: ExternalBlob) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateProfilePhoto(blob);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["therapistProfile"] }),
  });
}

export function useAddOrUpdateCVEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: CVEntry) => {
      if (!actor) throw new Error("Not connected");
      await actor.addOrUpdateCVEntry(entry);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cvEntries"] }),
  });
}

export function useDeleteCVEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteCVEntry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cvEntries"] }),
  });
}

export function useAddOrUpdatePricingPackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pkg: PricingPackage) => {
      if (!actor) throw new Error("Not connected");
      await actor.addOrUpdatePricingPackage(pkg);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pricingPackages"] }),
  });
}

export function useDeletePricingPackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deletePricingPackage(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pricingPackages"] }),
  });
}

export function useAddOrUpdateSessionContentItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: SessionContentItem) => {
      if (!actor) throw new Error("Not connected");
      await actor.addOrUpdateSessionContentItem(item);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["sessionContentItems"] }),
  });
}

export function useDeleteSessionContentItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteSessionContentItem(id);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["sessionContentItems"] }),
  });
}

export function useTherapistPhotoUrl(
  photo: Uint8Array | undefined,
): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!photo || photo.length <= 1) {
      setUrl(null);
      return;
    }

    const SENTINEL = "!caf!";
    const decoded = new TextDecoder().decode(new Uint8Array(photo));

    if (decoded.startsWith(SENTINEL)) {
      const hash = decoded.substring(SENTINEL.length);
      loadConfig().then((config) => {
        const storageUrl = `${config.storage_gateway_url}/v1/blob/?blob_hash=${encodeURIComponent(hash)}&owner_id=${encodeURIComponent(config.backend_canister_id)}&project_id=${encodeURIComponent(config.project_id)}`;
        setUrl(storageUrl);
      });
    } else {
      const blob = new Blob([new Uint8Array(photo)], { type: "image/jpeg" });
      const blobUrl = URL.createObjectURL(blob);
      setUrl(blobUrl);
      return () => URL.revokeObjectURL(blobUrl);
    }
  }, [photo]);

  return url;
}

export function photoBytesToUrl(photo: Uint8Array): string {
  const arr = new Uint8Array(photo);
  const blob = new Blob([arr], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
}
