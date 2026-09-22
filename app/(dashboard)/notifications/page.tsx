"use client";

import { Alert, Badge, Button, Center, Group, Loader, Stack, Table, Text, Title } from "@mantine/core";
import { notifications as mantineNotifications } from "@mantine/notifications";
import { IconAlertCircle, IconBellRinging, IconPlus } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { getUsers } from "@/api/auth";
import {
  getSentNotifications,
  sendNotification,
  type SendNotificationPayload,
} from "@/api/notifications";
import { PlaceholderPage } from "@/components/placeholder-page";
import { SendNotificationModal } from "@/components/send-notification-modal";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/format";

const NOTIFICATIONS_KEY = ["admin", "notifications", "sent"];

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: notifications,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: getSentNotifications,
  });

  const { data: users } = useQuery({ queryKey: ["admin", "users"], queryFn: getUsers });

  const recipients = useMemo(
    () =>
      (users ?? [])
        .filter((u) => u.role === "customer")
        .map((u) => ({ value: u.id, label: `${u.fullname} (${u.email})` })),
    [users]
  );

  const sendMutation = useMutation({
    mutationFn: sendNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      mantineNotifications.show({ message: "Notification sent", color: "green" });
      setModalOpen(false);
    },
    onError: (err) => mantineNotifications.show({ message: getErrorMessage(err), color: "red" }),
  });

  function handleSubmit(payload: SendNotificationPayload) {
    sendMutation.mutate(payload);
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Notifications</Title>
          <Text c="dimmed" size="sm">
            {isPending
              ? "Loading…"
              : `${notifications?.length ?? 0} sent notification${notifications?.length === 1 ? "" : "s"}`}
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setModalOpen(true)}>
          Send Notification
        </Button>
      </Group>

      {isPending ? (
        <Center mih={200}>
          <Loader />
        </Center>
      ) : isError ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="light"
          title="Couldn't load notifications"
        >
          {getErrorMessage(error)}
        </Alert>
      ) : notifications.length === 0 ? (
        <PlaceholderPage
          icon={IconBellRinging}
          title="No notifications sent yet"
          description='Click "Send Notification" to notify a customer.'
        />
      ) : (
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Recipient</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Message</Table.Th>
                <Table.Th>Sent</Table.Th>
                <Table.Th>Read</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {notifications.map((notif) => (
                <Table.Tr key={notif._id}>
                  <Table.Td>
                    <Text fw={500} size="sm">
                      {notif.userId.fullname}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {notif.userId.email}
                    </Text>
                  </Table.Td>
                  <Table.Td>{notif.title}</Table.Td>
                  <Table.Td maw={280}>
                    <Text size="sm" lineClamp={2}>
                      {notif.message}
                    </Text>
                  </Table.Td>
                  <Table.Td>{formatDate(notif.createdAt)}</Table.Td>
                  <Table.Td>
                    <Badge color={notif.isRead ? "green" : "gray"} variant="light">
                      {notif.isRead ? "Read" : "Unread"}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}

      <SendNotificationModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={sendMutation.isPending}
        recipients={recipients}
      />
    </Stack>
  );
}
