import { Group, Paper, Skeleton, Text, ThemeIcon, type MantineColor } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";

export type StatCardProps = {
  label: string;
  value?: number;
  isLoading: boolean;
  icon: Icon;
  color: MantineColor;
};

export function StatCard({ label, value, isLoading, icon: IconComponent, color }: StatCardProps) {
  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="sm" c="dimmed" fw={500}>
            {label}
          </Text>
          {isLoading ? (
            <Skeleton height={32} width={60} mt={6} />
          ) : (
            <Text fw={700} fz={28}>
              {value ?? "—"}
            </Text>
          )}
        </div>
        <ThemeIcon color={color} variant="light" size={40} radius="md">
          <IconComponent size={22} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
}
