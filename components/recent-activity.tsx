import { Center, Group, Loader, Paper, Stack, Text, Title, ThemeIcon } from "@mantine/core";
import { IconCalendarEvent, IconEPassport } from "@tabler/icons-react";

import { StatusBadge } from "@/components/status-badge";
import { formatRelativeTime } from "@/lib/format";

export type ActivityItem = {
  id: string;
  type: "booking" | "visa";
  customerName: string;
  description: string;
  status: string;
  createdAt: string;
};

export type RecentActivityProps = {
  items: ActivityItem[];
  isLoading: boolean;
};

const TYPE_ICON = { booking: IconCalendarEvent, visa: IconEPassport };
const TYPE_COLOR = { booking: "teal", visa: "orange" };

export function RecentActivity({ items, isLoading }: RecentActivityProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={4} mb="md">
        Recent Activity
      </Title>

      {isLoading ? (
        <Center mih={120}>
          <Loader size="sm" />
        </Center>
      ) : items.length === 0 ? (
        <Text c="dimmed" size="sm">
          No bookings or visa requests yet.
        </Text>
      ) : (
        <Stack gap="md">
          {items.map((item) => {
            const Icon = TYPE_ICON[item.type];
            return (
              <Group key={item.id} justify="space-between" wrap="nowrap" align="flex-start">
                <Group gap="sm" wrap="nowrap" align="flex-start">
                  <ThemeIcon color={TYPE_COLOR[item.type]} variant="light" size="lg" radius="xl">
                    <Icon size={18} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" fw={500}>
                      {item.customerName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {item.description}
                    </Text>
                  </div>
                </Group>
                <Stack gap={4} align="flex-end">
                  <StatusBadge status={item.status} />
                  <Text size="xs" c="dimmed">
                    {formatRelativeTime(item.createdAt)}
                  </Text>
                </Stack>
              </Group>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}
