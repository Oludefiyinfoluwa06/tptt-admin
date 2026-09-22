import { apiClient } from "@/lib/api-client";

export type BookingStatus = "pending" | "approved" | "rejected";

export type Booking = {
  _id: string;
  userId: { _id: string; fullname: string; email: string };
  packageId: { _id: string; title: string; destination: string; image?: string };
  travelers: number;
  travelDate: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
};

export async function getBookings(): Promise<Booking[]> {
  const { data } = await apiClient.get<{ bookings: Booking[] }>("/bookings");
  return data.bookings;
}
