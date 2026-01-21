import * as Icons from "../icons";
import type { UserRole } from "@/types/user.types";

export interface NavItem {
  title: string;
  url?: string;
  icon: React.FC<any>;
  items: { title: string; url: string }[];
  roles?: UserRole[]; // Which roles can see this item
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [],
        url: "/", // This will be overridden based on role
      },
      {
        title: "Users",
        url: "/users",
        icon: Icons.User,
        items: [],
        roles: ["RH"], // Only RH can see this
      },
      {
        title: "Candidates",
        url: "/candidates",
        icon: Icons.User,
        items: [],
        // All authenticated users can see this
      },
      {
        title: "Hiring Requests",
        url: "/hiring-requests",
        icon: Icons.Alphabet,
        items: [],
      },
      {
        title: "Interviews",
        url: "/interviews",
        icon: Icons.Calendar,
        items: [],
      },
    ],
  },
];

/**
 * Filter navigation items based on user role
 */
export function getNavDataForRole(role: UserRole | null): NavSection[] {
  if (!role) return [];

  return NAV_DATA.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      // If item has no role restrictions, show it to all
      if (!item.roles || item.roles.length === 0) return true;
      // Otherwise, check if user's role is in the allowed roles
      return item.roles.includes(role);
    }),
  })).filter((section) => section.items.length > 0); // Remove empty sections
}

/**
 * Get role-specific dashboard URL
 */
export function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case "RH":
      return "/dashboard/rh";
    case "Manager":
      return "/dashboard/manager";
    case "CO":
      return "/dashboard/co";
    case "Directeur":
      return "/dashboard/directeur";
    default:
      return "/";
  }
}
