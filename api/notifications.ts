import { apiClient } from "@/lib/api-client";

export type Notification = {
  _id: string;
  userId: { _id: string; fullname: string; email: string };
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type SendNotificationPayload = {
  userId: string;
  title: string;
  message: string;
};

export async function getSentNotifications(): Promise<Notification[]> {
  const { data } = await apiClient.get<{ notifications: Notification[] }>("/notifications/sent");
  return data.notifications;
}

export async function sendNotification(payload: SendNotificationPayload): Promise<Notification> {
  const { data } = await apiClient.post<{ notification: Notification }>("/notifications", payload);
  return data.notification;
}
