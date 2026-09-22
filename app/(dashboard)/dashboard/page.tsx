"use client";

import { SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconCalendarEvent, IconEPassport, IconLuggage, IconUsers } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { getUsers } from "@/api/auth";
import { getBookings } from "@/api/bookings";
import { getPackages } from "@/api/packages";
import { getVisaRequests } from "@/api/visa";
import { StatCard } from "@/components/stat-card";

export default function DashboardPage() {
  const usersQuery = useQuery({ queryKey: ["admin", "users"], queryFn: getUsers });
  const packagesQuery = useQuery({ queryKey: ["admin", "packages"], queryFn: getPackages });
  const bookingsQuery = useQuery({ queryKey: ["admin", "bookings"], queryFn: getBookings });
  const visaQuery = useQuery({ queryKey: ["admin", "visa-requests"], queryFn: getVisaRequests });

  const customerCount = usersQuery.data?.filter((u) => u.role === "customer").length;
  const pendingBookings = bookingsQuery.data?.filter((b) => b.status === "pending").length;

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Dashboard</Title>
        <Text c="dimmed" size="sm">
          Overview of the platform&apos;s activity
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        <StatCard
          label="Customers"
          value={customerCount}
          isLoading={usersQuery.isPending}
          icon={IconUsers}
          color="blue"
        />
        <StatCard
          label="Packages"
          value={packagesQuery.data?.length}
          isLoading={packagesQuery.isPending}
          icon={IconLuggage}
          color="grape"
        />
        <StatCard
          label="Bookings"
          value={bookingsQuery.data?.length}
          isLoading={bookingsQuery.isPending}
          icon={IconCalendarEvent}
          color="teal"
        />
        <StatCard
          label="Visa Requests"
          value={visaQuery.data?.length}
          isLoading={visaQuery.isPending}
          icon={IconEPassport}
          color="orange"
        />
      </SimpleGrid>

      {pendingBookings ? (
        <Text size="sm" c="dimmed">
          {pendingBookings} booking{pendingBookings === 1 ? "" : "s"} awaiting review.
        </Text>
      ) : null}
    </Stack>
  );
}
