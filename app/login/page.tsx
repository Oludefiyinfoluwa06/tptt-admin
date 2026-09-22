"use client";

import {
  Alert,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconPlaneTilt } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getErrorMessage } from "@/lib/api-client";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isBootstrapping } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email"),
      password: (value) => (value.length > 0 ? null : "Password is required"),
    },
  });

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isBootstrapping, isAuthenticated, router]);

  async function handleSubmit(values: typeof form.values) {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(values);
      router.replace("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to log in. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Center mih="100vh" bg="var(--mantine-color-gray-0)">
      <Paper withBorder shadow="sm" radius="md" p="xl" w={380}>
        <Stack align="center" gap="xs" mb="lg">
          <IconPlaneTilt size={36} color="var(--mantine-color-blue-6)" />
          <Title order={2}>TPTT Admin</Title>
          <Text c="dimmed" size="sm">
            Sign in to manage the platform
          </Text>
        </Stack>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Email"
              placeholder="admin@example.com"
              autoComplete="email"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...form.getInputProps("password")}
            />

            {error ? (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                {error}
              </Alert>
            ) : null}

            <Button type="submit" fullWidth loading={isSubmitting} mt="xs">
              Log in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
