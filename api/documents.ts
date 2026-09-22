import { apiClient } from "@/lib/api-client";
import type { VisaStatus } from "@/api/visa";

export type Document = {
  _id: string;
  userId: { _id: string; fullname: string; email: string };
  visaRequestId: { _id: string; country: string; visaType: string; status: VisaStatus };
  documentType: string;
  fileUrl: string;
  createdAt: string;
};

export async function getDocuments(): Promise<Document[]> {
  const { data } = await apiClient.get<{ documents: Document[] }>("/documents");
  return data.documents;
}
