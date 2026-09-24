"use client";

import { Alert, Center, Group, Loader, Select, Stack, Table, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconEPassport } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getVisaRequests, updateVisaRequestStatus, type VisaStatus } from "@/api/visa";
import { PlaceholderPage } from "@/components/placeholder-page";
import { StatusBadge } from "@/components/status-badge";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/format";

const VISA_REQUESTS_KEY = ["admin", "visa-requests"];

const STATUS_OPTIONS: { value: VisaStatus; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "documents_received", label: "Documents Received" },
  { value: "processing", label: "Processing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function VisaRequestsPage() {
  const queryClient = useQueryClient();

  const {
    data: visaRequests,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: VISA_REQUESTS_KEY,
    queryFn: getVisaRequests,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: VisaStatus }) => updateVisaRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISA_REQUESTS_KEY });
      notifications.show({ message: "Visa request status updated", color: "green" });
    },
    onError: (err) => notifications.show({ message: getErrorMessage(err), color: "red" }),
  });

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Visa Requests</Title>
        <Text c="dimmed" size="sm">
          {isPending
            ? "Loading…"
            : `${visaRequests?.length ?? 0} request${visaRequests?.length === 1 ? "" : "s"}`}
        </Text>
      </div>

      {isPending ? (
        <Center mih={200}>
          <Loader />
        </Center>
      ) : isError ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="light"
          title="Couldn't load visa requests"
        >
          {getErrorMessage(error)}
        </Alert>
      ) : visaRequests.length === 0 ? (
        <PlaceholderPage
          icon={IconEPassport}
          title="No visa requests yet"
          description="Visa requests from customers will show up here."
        />
      ) : (
        <Table.ScrollContainer minWidth={900}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Country</Table.Th>
                <Table.Th>Visa Type</Table.Th>
                <Table.Th>Purpose</Table.Th>
                <Table.Th>Submitted</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {visaRequests.map((request) => (
                <Table.Tr key={request._id}>
                  <Table.Td>
                    <Text fw={500} size="sm">
                      {request.userId.fullname}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {request.userId.email}
                    </Text>
                  </Table.Td>
                  <Table.Td>{request.country}</Table.Td>
                  <Table.Td>{request.visaType}</Table.Td>
                  <Table.Td maw={220}>
                    <Text size="sm" lineClamp={2}>
                      {request.purpose}
                    </Text>
                  </Table.Td>
                  <Table.Td>{formatDate(request.createdAt)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs" wrap="nowrap">
                      <StatusBadge status={request.status} />
                      <Select
                        size="xs"
                        w={170}
                        data={STATUS_OPTIONS}
                        value={request.status}
                        onChange={(value) =>
                          value && value !== request.status
                            ? statusMutation.mutate({ id: request._id, status: value as VisaStatus })
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
