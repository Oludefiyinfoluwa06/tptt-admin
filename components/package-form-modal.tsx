"use client";

import { Button, Group, Modal, NumberInput, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

import type { Package, PackagePayload } from "@/api/packages";

export type PackageFormModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: PackagePayload) => void;
  isSubmitting: boolean;
  initialValues?: Package | null;
};

const EMPTY_VALUES = {
  title: "",
  destination: "",
  description: "",
  duration: "",
  price: 0,
  image: "",
};

export function PackageFormModal({
  opened,
  onClose,
  onSubmit,
  isSubmitting,
  initialValues,
}: PackageFormModalProps) {
  const form = useForm({
    initialValues: EMPTY_VALUES,
    validate: {
      title: (value) => (value.trim() ? null : "Title is required"),
      destination: (value) => (value.trim() ? null : "Destination is required"),
      description: (value) => (value.trim() ? null : "Description is required"),
      duration: (value) => (value.trim() ? null : "Duration is required"),
      price: (value) => (Number(value) > 0 ? null : "Price must be greater than 0"),
    },
  });

  // Reset the form to the package being edited (or a blank form) each time the modal opens.
  useEffect(() => {
    if (!opened) return;
    form.setValues(
      initialValues
        ? {
            title: initialValues.title,
            destination: initialValues.destination,
            description: initialValues.description,
            duration: initialValues.duration,
            price: initialValues.price,
            image: initialValues.image ?? "",
          }
        : EMPTY_VALUES
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initialValues]);

  function handleSubmit(values: typeof form.values) {
    onSubmit({ ...values, price: Number(values.price), image: values.image || undefined });
  }

  return (
    <Modal opened={opened} onClose={onClose} title={initialValues ? "Edit Package" : "New Package"} size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput label="Title" placeholder="Bali Getaway" {...form.getInputProps("title")} />
          <TextInput
            label="Destination"
            placeholder="Bali, Indonesia"
            {...form.getInputProps("destination")}
          />
          <Textarea
            label="Description"
            placeholder="A relaxing week exploring Bali's beaches and temples."
            minRows={3}
            {...form.getInputProps("description")}
          />
          <Group grow>
            <TextInput label="Duration" placeholder="7 days" {...form.getInputProps("duration")} />
            <NumberInput
              label="Price"
              placeholder="1200"
              min={0}
              prefix="$"
              thousandSeparator=","
              {...form.getInputProps("price")}
            />
          </Group>
          <TextInput
            label="Image URL (optional)"
            placeholder="https://..."
            {...form.getInputProps("image")}
          />

          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {initialValues ? "Save Changes" : "Create Package"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
