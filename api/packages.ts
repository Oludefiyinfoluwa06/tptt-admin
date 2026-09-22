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
  image?: string;
};

export async function getPackages(): Promise<Package[]> {
  const { data } = await apiClient.get<{ packages: Package[] }>("/packages");
  return data.packages;
}

export async function createPackage(payload: PackagePayload): Promise<Package> {
  const { data } = await apiClient.post<{ package: Package }>("/packages", payload);
  return data.package;
}

export async function updatePackage(id: string, payload: PackagePayload): Promise<Package> {
  const { data } = await apiClient.put<{ package: Package }>(`/packages/${id}`, payload);
  return data.package;
}

export async function deletePackage(id: string): Promise<void> {
  await apiClient.delete(`/packages/${id}`);
}
