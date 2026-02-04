import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { useState } from "react";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    onCheckedChange: { action: "onCheckedChange" },
    disabled: { control: "boolean" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    checked: false,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm">Small:</span>
        <Switch size="sm" checked />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Medium:</span>
        <Switch size="md" checked />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Large:</span>
        <Switch size="lg" checked />
      </div>
    </div>
  ),
};

export const Interactive = () => {
  const [checked, setChecked] = useState(false);
  return <Switch checked={checked} onCheckedChange={setChecked} />;
};
