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

export async function getPackages(): Promise<Package[]> {
  const { data } = await apiClient.get<{ packages: Package[] }>("/packages");
  return data.packages;
}
