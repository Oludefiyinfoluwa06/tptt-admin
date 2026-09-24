"use client";

import { ActionIcon, AppShell, Burger, Center, Group, Loader, NavLink, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout, IconPlaneTilt } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { NAV_LINKS } from "@/components/nav-links";
import { useAuth } from "@/context/auth-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isBootstrapping, logout } = useAuth();
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    if (!isBootstrapping && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isBootstrapping, isAuthenticated, router]);

  if (isBootstrapping || !isAuthenticated) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <IconPlaneTilt size={22} color="var(--mantine-color-blue-6)" />
            <Text fw={700}>TPTT Admin</Text>
          </Group>
          <Group gap="sm">
            <Text size="sm" c="dimmed" visibleFrom="xs">
              {user?.fullname}
            </Text>
            <ActionIcon variant="subtle" color="gray" onClick={logout} aria-label="Log out">
              <IconLogout size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.href}
            component={Link}
            href={link.href}
            label={link.label}
            leftSection={<link.icon size={18} />}
            active={pathname === link.href}
            mb={4}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
