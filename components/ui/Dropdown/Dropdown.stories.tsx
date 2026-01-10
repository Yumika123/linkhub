import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";
import { UserProfile, Button } from "@/components/ui";

const meta: Meta<typeof Dropdown> = {
  title: "UI/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64 min-h-[300px] flex items-end justify-center pb-10">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const TriggerContent = (
  <UserProfile name="John Doe" image={null} subtitle="Linkhub" />
);

const MenuContent = (
  <>
    <Button
      variant="ghost"
      withScale={false}
      rounded="md"
      className="w-full justify-start text-sm font-normal text-white/80 hover:text-white px-3 py-2 h-auto"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="mr-2 opacity-70"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      Profile
    </Button>
    <div className="h-px bg-white/10 my-1 mx-2" />
    <Button
      variant="ghost"
      withScale={false}
      rounded="md"
      className="w-full justify-start text-sm font-normal text-red-300 hover:text-red-200 hover:bg-red-500/10 px-3 py-2 h-auto"
    >
      Sign Out
    </Button>
  </>
);

export const Default: Story = {
  args: {
    trigger: TriggerContent,
    children: MenuContent,
  },
};

export const OpenBottom: Story = {
  decorators: [
    (Story) => (
      <div className="w-64 min-h-[300px] flex items-start justify-center pt-10">
        <Story />
      </div>
    ),
  ],
  args: {
    trigger: TriggerContent,
    children: MenuContent,
    side: "bottom",
  },
};
