import { apiClient } from "@/lib/api-client";

export type Package = {
  _id: string;
  title: string;
  destination: string;
  description: string;
  duration: string;
  price: number;
  image?: string;
};

export type PackagePayload = {
  title: string;
  destination: string;
  description: string;
  duration: string;
  price: number;
  image?: File;
};

function toFormData(payload: PackagePayload): FormData {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("destination", payload.destination);
  formData.append("description", payload.description);
  formData.append("duration", payload.duration);
  formData.append("price", String(payload.price));
  if (payload.image) {
    formData.append("image", payload.image);
  }
  return formData;
}

export async function getPackages(): Promise<Package[]> {
  const { data } = await apiClient.get<{ packages: Package[] }>("/packages");
  return data.packages;
}

export async function createPackage(payload: PackagePayload): Promise<Package> {
  const { data } = await apiClient.post<{ package: Package }>("/packages", toFormData(payload));
  return data.package;
}

export async function updatePackage(id: string, payload: PackagePayload): Promise<Package> {
  const { data } = await apiClient.put<{ package: Package }>(`/packages/${id}`, toFormData(payload));
  return data.package;
}

export async function deletePackage(id: string): Promise<void> {
  await apiClient.delete(`/packages/${id}`);
}
