"use client";

import { Button, Group, Modal, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

import type { SendNotificationPayload } from "@/api/notifications";

export type SendNotificationModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: SendNotificationPayload) => void;
  isSubmitting: boolean;
  recipients: { value: string; label: string }[];
};

const EMPTY_VALUES = { userId: "", title: "", message: "" };

export function SendNotificationModal({
  opened,
  onClose,
  onSubmit,
  isSubmitting,
  recipients,
}: SendNotificationModalProps) {
  const form = useForm({
    initialValues: EMPTY_VALUES,
    validate: {
      userId: (value) => (value ? null : "Select a recipient"),
      title: (value) => (value.trim() ? null : "Title is required"),
      message: (value) => (value.trim() ? null : "Message is required"),
    },
  });

  useEffect(() => {
    if (!opened) return;
    form.setValues(EMPTY_VALUES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <Modal opened={opened} onClose={onClose} title="Send Notification" size="md">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="sm">
          <Select
            label="Recipient"
            placeholder="Select a customer"
            data={recipients}
            searchable
            {...form.getInputProps("userId")}
          />
          <TextInput label="Title" placeholder="Booking Approved" {...form.getInputProps("title")} />
          <Textarea
            label="Message"
            placeholder="Your booking has been approved."
            minRows={3}
            {...form.getInputProps("message")}
          />

          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Send
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
