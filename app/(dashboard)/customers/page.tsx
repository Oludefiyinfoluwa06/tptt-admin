"use client";

import { Alert, Avatar, Center, Group, Loader, Stack, Table, Text, TextInput, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconAlertCircle, IconSearch, IconUsers } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { getUsers } from "@/api/auth";
import { PlaceholderPage } from "@/components/placeholder-page";
import { getErrorMessage } from "@/lib/api-client";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 200);

  const {
    data: users,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getUsers,
  });

  const customers = useMemo(() => {
    const list = users?.filter((u) => u.role === "customer") ?? [];
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return list;
    return list.filter(
      (c) => c.fullname.toLowerCase().includes(query) || c.email.toLowerCase().includes(query)
    );
  }, [users, debouncedSearch]);

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Customers</Title>
        <Text c="dimmed" size="sm">
          {isPending ? "Loading…" : `${customers.length} customer${customers.length === 1 ? "" : "s"}`}
        </Text>
      </div>

      <TextInput
        placeholder="Search by name or email"
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        maw={360}
        disabled={isPending || isError}
      />

      {isPending ? (
        <Center mih={200}>
          <Loader />
        </Center>
      ) : isError ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="light"
          title="Couldn't load customers"
        >
          {getErrorMessage(error)}
        </Alert>
      ) : customers.length === 0 ? (
        <PlaceholderPage
          icon={IconUsers}
          title="No customers found"
          description={search ? "Try a different search." : "No customers have registered yet."}
        />
      ) : (
        <Table.ScrollContainer minWidth={600}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Joined</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {customers.map((customer) => (
                <Table.Tr key={customer.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar name={customer.fullname} color="initials" radius="xl" size={36} />
                      <Text fw={500} size="sm">
                        {customer.fullname}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{customer.email}</Table.Td>
                  <Table.Td>{customer.phone || "—"}</Table.Td>
                  <Table.Td>{dateFormatter.format(new Date(customer.createdAt))}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Stack>
  );
}
