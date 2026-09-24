"use client";

import { ActionIcon, Alert, Button, Center, Group, Image, Loader, Stack, Table, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconLuggage, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  createPackage,
  deletePackage,
  getPackages,
  updatePackage,
  type Package,
  type PackagePayload,
} from "@/api/packages";
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal";
import { PackageFormModal } from "@/components/package-form-modal";
import { PlaceholderPage } from "@/components/placeholder-page";
import { getErrorMessage } from "@/lib/api-client";
import { formatPrice } from "@/lib/format";

const PACKAGES_KEY = ["admin", "packages"];

export default function PackagesPage() {
  const queryClient = useQueryClient();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null);

  const { data: packages, isPending, isError, error } = useQuery({
    queryKey: PACKAGES_KEY,
    queryFn: getPackages,
  });

  const createMutation = useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKAGES_KEY });
      notifications.show({ message: "Package created", color: "green" });
      setFormModalOpen(false);
    },
    onError: (err) => notifications.show({ message: getErrorMessage(err), color: "red" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PackagePayload }) => updatePackage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKAGES_KEY });
      notifications.show({ message: "Package updated", color: "green" });
      setFormModalOpen(false);
      setEditingPackage(null);
    },
    onError: (err) => notifications.show({ message: getErrorMessage(err), color: "red" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKAGES_KEY });
      notifications.show({ message: "Package deleted", color: "green" });
      setDeletingPackage(null);
    },
    onError: (err) => notifications.show({ message: getErrorMessage(err), color: "red" }),
  });

  function handleNew() {
    setEditingPackage(null);
    setFormModalOpen(true);
  }

  function handleEdit(pkg: Package) {
    setEditingPackage(pkg);
    setFormModalOpen(true);
  }

  function handleFormSubmit(payload: PackagePayload) {
    if (editingPackage) {
      updateMutation.mutate({ id: editingPackage._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Packages</Title>
          <Text c="dimmed" size="sm">
            {isPending
              ? "Loading…"
              : `${packages?.length ?? 0} package${packages?.length === 1 ? "" : "s"}`}
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={handleNew}>
          New Package
        </Button>
      </Group>

      {isPending ? (
        <Center mih={200}>
          <Loader />
        </Center>
      ) : isError ? (
        <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" title="Couldn't load packages">
          {getErrorMessage(error)}
        </Alert>
      ) : packages.length === 0 ? (
        <PlaceholderPage
          icon={IconLuggage}
          title="No packages yet"
          description='Click "New Package" to add the first one.'
        />
      ) : (
        <Table.ScrollContainer minWidth={700}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th></Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Destination</Table.Th>
                <Table.Th>Duration</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {packages.map((pkg) => (
                <Table.Tr key={pkg._id}>
                  <Table.Td w={56}>
                    {pkg.image ? (
                      <Image src={pkg.image} alt={pkg.title} w={40} h={40} radius="sm" fit="cover" />
                    ) : (
                      <Center w={40} h={40} bg="gray.1" style={{ borderRadius: 6 }}>
                        <IconLuggage size={18} color="var(--mantine-color-gray-5)" />
                      </Center>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500} size="sm">
                      {pkg.title}
                    </Text>
                  </Table.Td>
                  <Table.Td>{pkg.destination}</Table.Td>
                  <Table.Td>{pkg.duration}</Table.Td>
                  <Table.Td>{formatPrice(pkg.price)}</Table.Td>
                  <Table.Td>
                    <Group gap={4} justify="flex-end">
                      <ActionIcon variant="subtle" color="gray" onClick={() => handleEdit(pkg)} aria-label="Edit">
                        <IconPencil size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => setDeletingPackage(pkg)}
                        aria-label="Delete"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}

      <PackageFormModal
        opened={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingPackage(null);
        }}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialValues={editingPackage}
      />

      <ConfirmDeleteModal
        opened={!!deletingPackage}
        onClose={() => setDeletingPackage(null)}
        onConfirm={() => deletingPackage && deleteMutation.mutate(deletingPackage._id)}
        isDeleting={deleteMutation.isPending}
        title="Delete package"
        description={`Are you sure you want to delete "${deletingPackage?.title}"? This can't be undone.`}
      />
    </Stack>
  );
}
