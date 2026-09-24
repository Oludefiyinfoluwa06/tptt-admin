"use client";

import { Alert, Center, Group, Loader, Select, Stack, Table, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCalendarEvent } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getBookings, updateBookingStatus, type BookingStatus } from "@/api/bookings";
import { PlaceholderPage } from "@/components/placeholder-page";
import { StatusBadge } from "@/components/status-badge";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/format";

const BOOKINGS_KEY = ["admin", "bookings"];

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function BookingsPage() {
  const queryClient = useQueryClient();

  const {
    data: bookings,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: BOOKINGS_KEY,
    queryFn: getBookings,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
      notifications.show({ message: "Booking status updated", color: "green" });
    },
    onError: (err) => notifications.show({ message: getErrorMessage(err), color: "red" }),
  });

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Bookings</Title>
        <Text c="dimmed" size="sm">
          {isPending ? "Loading…" : `${bookings?.length ?? 0} booking${bookings?.length === 1 ? "" : "s"}`}
        </Text>
      </div>

      {isPending ? (
        <Center mih={200}>
          <Loader />
        </Center>
      ) : isError ? (
        <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" title="Couldn't load bookings">
          {getErrorMessage(error)}
        </Alert>
      ) : bookings.length === 0 ? (
        <PlaceholderPage
          icon={IconCalendarEvent}
          title="No bookings yet"
          description="Booking requests from customers will show up here."
        />
      ) : (
        <Table.ScrollContainer minWidth={900}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Package</Table.Th>
                <Table.Th>Travelers</Table.Th>
                <Table.Th>Travel Date</Table.Th>
                <Table.Th>Requested</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {bookings.map((booking) => (
                <Table.Tr key={booking._id}>
                  <Table.Td>
                    <Text fw={500} size="sm">
                      {booking.userId.fullname}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {booking.userId.email}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500} size="sm">
                      {booking.packageId.title}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {booking.packageId.destination}
                    </Text>
                  </Table.Td>
                  <Table.Td>{booking.travelers}</Table.Td>
                  <Table.Td>{formatDate(booking.travelDate)}</Table.Td>
                  <Table.Td>{formatDate(booking.createdAt)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs" wrap="nowrap">
                      <StatusBadge status={booking.status} />
                      <Select
                        size="xs"
                        w={130}
                        data={STATUS_OPTIONS}
                        value={booking.status}
                        onChange={(value) =>
                          value && value !== booking.status
                            ? statusMutation.mutate({ id: booking._id, status: value as BookingStatus })
                            : undefined
                        }
                        disabled={statusMutation.isPending}
                        allowDeselect={false}
                      />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Stack>
  );
}
