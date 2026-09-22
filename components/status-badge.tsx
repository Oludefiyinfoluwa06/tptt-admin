import { Badge } from "@mantine/core";

// Covers booking statuses (pending/approved/rejected) and visa statuses
// (submitted/documents_received/processing/approved/rejected) so it's reusable
// across features without changes.
const STATUS_COLORS: Record<string, string> = {
  pending: "yellow",
  submitted: "yellow",
  documents_received: "blue",
  processing: "blue",
  approved: "green",
  rejected: "red",
};

export type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge color={STATUS_COLORS[status] ?? "gray"} variant="light">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
