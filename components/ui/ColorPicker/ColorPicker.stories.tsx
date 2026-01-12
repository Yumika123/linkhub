import type { Meta, StoryObj } from "@storybook/react";
import { ColorPicker } from "./ColorPicker";
import { useState } from "react";

const meta: Meta<typeof ColorPicker> = {
  title: "UI/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const SolidColor: Story = {
  render: () => {
    const [color, setColor] = useState("#6366f1");
    return (
      <ColorPicker
        value={color}
        onChange={setColor}
        label="Background Color"
        allowGradient={false}
      />
    );
  },
};

export const WithGradient: Story = {
  render: () => {
    const [color, setColor] = useState(
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    );
    return (
      <ColorPicker
        value={color}
        onChange={setColor}
        label="Background"
        allowGradient={true}
      />
    );
  },
};
