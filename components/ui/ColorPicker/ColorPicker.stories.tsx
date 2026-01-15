import type { Meta, StoryObj } from "@storybook/react";
import { ColorPicker, PRESET_COLORS } from "./ColorPicker";
import { useForm, useWatch } from "react-hook-form";

const meta: Meta<typeof ColorPicker> = {
  title: "UI/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-4 bg-slate-900 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

// Wrapper to provide react-hook-form context
const ColorPickerWrapper = ({
  initialValue,
  label,
}: {
  initialValue?: any;
  label?: string;
}) => {
  const { control } = useForm({
    defaultValues: initialValue || {
      colorMode: "solid",
      colorSolid: PRESET_COLORS[0],
      colorGradient1: PRESET_COLORS[0],
      colorGradient2: PRESET_COLORS[1],
    },
  });

  const values = useWatch({ control });

  return (
    <div className="space-y-4">
      <ColorPicker control={control} label={label} prefix="color" />
      <div className="p-4 bg-black/20 rounded text-xs text-white/70 font-mono">
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
    </div>
  );
};

export const SolidColor: Story = {
  render: () => (
    <ColorPickerWrapper
      label="Background Color (Solid Default)"
      initialValue={{
        colorMode: "solid",
        colorSolid: "#6366f1",
        colorGradient1: "#6366f1",
        colorGradient2: "#8b5cf6",
      }}
    />
  ),
};

export const WithGradient: Story = {
  render: () => (
    <ColorPickerWrapper
      label="Background (Gradient Default)"
      initialValue={{
        colorMode: "gradient",
        colorSolid: "#6366f1",
        colorGradient1: "#667eea",
        colorGradient2: "#764ba2",
      }}
    />
  ),
};
