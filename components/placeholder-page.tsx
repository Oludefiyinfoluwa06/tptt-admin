import { Center, EmptyState } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";

export type PlaceholderPageProps = {
  icon: Icon;
  title: string;
  description: string;
};

export function PlaceholderPage({ icon: IconComponent, title, description }: PlaceholderPageProps) {
  return (
    <Center mih="60vh">
      <EmptyState
        icon={<IconComponent size={28} />}
        variant="light"
        title={title}
        description={description}
      />
    </Center>
  );
}
