import { apiClient } from "@/lib/api-client";

export type VisaStatus = "submitted" | "documents_received" | "processing" | "approved" | "rejected";

export type VisaRequest = {
  _id: string;
  userId: { _id: string; fullname: string; email: string };
  country: string;
  visaType: string;
  purpose: string;
  status: VisaStatus;
  createdAt: string;
};

export async function getVisaRequests(): Promise<VisaRequest[]> {
  const { data } = await apiClient.get<{ visaRequests: VisaRequest[] }>("/visa");
  return data.visaRequests;
}

export async function updateVisaRequestStatus(id: string, status: VisaStatus): Promise<VisaRequest> {
  const { data } = await apiClient.patch<{ visaRequest: VisaRequest }>(`/visa/${id}/status`, { status });
  return data.visaRequest;
}
