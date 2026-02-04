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
    variant: {
      control: "select",
      options: ["default", "circle"],
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

export const CircleVariant: Story = {
  args: {
    variant: "circle",
    checked: true,
  },
};

export const CircleVariantUnchecked: Story = {
  args: {
    variant: "circle",
    checked: false,
  },
};

export const CircleSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 bg-slate-800 rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm text-white w-16">Small:</span>
        <Switch variant="circle" size="sm" checked />
        <Switch variant="circle" size="sm" checked={false} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-white w-16">Medium:</span>
        <Switch variant="circle" size="md" checked />
        <Switch variant="circle" size="md" checked={false} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-white w-16">Large:</span>
        <Switch variant="circle" size="lg" checked />
        <Switch variant="circle" size="lg" checked={false} />
      </div>
    </div>
  ),
};

export const CircleInteractive = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="p-4 bg-slate-800 rounded-lg">
      <Switch variant="circle" checked={checked} onCheckedChange={setChecked} />
    </div>
  );
};
