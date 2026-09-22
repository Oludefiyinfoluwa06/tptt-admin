"use client";

import { Button, Group, Modal, Text } from "@mantine/core";

export type ConfirmDeleteModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
  description: string;
};

export function ConfirmDeleteModal({
  opened,
  onClose,
  onConfirm,
  isDeleting,
  title,
  description,
}: ConfirmDeleteModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} size="sm">
      <Text size="sm" c="dimmed" mb="lg">
        {description}
      </Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" loading={isDeleting} onClick={onConfirm}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
}
