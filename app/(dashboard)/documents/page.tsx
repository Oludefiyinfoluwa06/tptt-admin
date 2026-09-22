"use client";

import { Alert, Anchor, Center, Group, Loader, Stack, Table, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconExternalLink, IconFileText } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { getDocuments } from "@/api/documents";
import { PlaceholderPage } from "@/components/placeholder-page";
import { StatusBadge } from "@/components/status-badge";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/format";

export default function DocumentsPage() {
  const {
    data: documents,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin", "documents"],
    queryFn: getDocuments,
  });

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Documents</Title>
        <Text c="dimmed" size="sm">
          {isPending
            ? "Loading…"
            : `${documents?.length ?? 0} document${documents?.length === 1 ? "" : "s"}`}
        </Text>
      </div>

      {isPending ? (
        <Center mih={200}>
          <Loader />
        </Center>
      ) : isError ? (
        <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" title="Couldn't load documents">
          {getErrorMessage(error)}
        </Alert>
      ) : documents.length === 0 ? (
        <PlaceholderPage
          icon={IconFileText}
          title="No documents yet"
          description="Documents customers upload for visa requests will show up here."
        />
      ) : (
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Visa Request</Table.Th>
                <Table.Th>Document Type</Table.Th>
                <Table.Th>Uploaded</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {documents.map((doc) => (
                <Table.Tr key={doc._id}>
                  <Table.Td>
                    <Text fw={500} size="sm">
                      {doc.userId.fullname}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {doc.userId.email}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500} size="sm">
                      {doc.visaRequestId.country}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {doc.visaRequestId.visaType}
                    </Text>
                  </Table.Td>
                  <Table.Td>{doc.documentType}</Table.Td>
                  <Table.Td>{formatDate(doc.createdAt)}</Table.Td>
                  <Table.Td>
                    <StatusBadge status={doc.visaRequestId.status} />
                  </Table.Td>
                  <Table.Td>
                    <Anchor href={doc.fileUrl} target="_blank" rel="noopener noreferrer" size="sm">
                      <Group gap={4} wrap="nowrap">
                        View <IconExternalLink size={14} />
                      </Group>
                    </Anchor>
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
