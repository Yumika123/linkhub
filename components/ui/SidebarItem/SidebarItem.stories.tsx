import type { Meta, StoryObj } from "@storybook/react";
import { SidebarItem } from "./SidebarItem";

const meta: Meta<typeof SidebarItem> = {
  title: "UI/SidebarItem",
  component: SidebarItem,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SidebarItem>;

export const Default: Story = {
  args: {
    label: "Personal Links",
    sublabel: "/personal",
    badge: 5,
    href: "#",
  },
};

export const Active: Story = {
  args: {
    label: "Personal Links",
    sublabel: "/personal",
    badge: 12,
    href: "#",
    isActive: true,
  },
};
