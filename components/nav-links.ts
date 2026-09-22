import {
  IconCalendarEvent,
  IconEPassport,
  IconFileText,
  IconLayoutDashboard,
  IconLuggage,
  IconNotification,
  IconUsers,
  type Icon,
} from "@tabler/icons-react";

export type NavLinkConfig = {
  label: string;
  href: string;
  icon: Icon;
};

export const NAV_LINKS: NavLinkConfig[] = [
  { label: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { label: "Customers", href: "/customers", icon: IconUsers },
  { label: "Packages", href: "/packages", icon: IconLuggage },
  { label: "Bookings", href: "/bookings", icon: IconCalendarEvent },
  { label: "Visa Requests", href: "/visa-requests", icon: IconEPassport },
  { label: "Documents", href: "/documents", icon: IconFileText },
  { label: "Notifications", href: "/notifications", icon: IconNotification },
];
