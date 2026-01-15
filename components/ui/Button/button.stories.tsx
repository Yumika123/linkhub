import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import React from "react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "ghost",
        "outline",
        "glass",
        "danger",
        "gradient",
        "brand",
        "black",
      ],
    },
    buttonSize: {
      control: "select",
      options: ["sm", "md", "lg", "icon", "fab"],
    },
    rounded: {
      control: "select",
      options: ["md", "lg", "xl", "full"],
    },
    withScale: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Glass: Story = {
  args: {
    children: "Glass Button",
    variant: "glass",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};

export const Danger: Story = {
  args: {
    children: "Delete Item",
    variant: "danger",
  },
};

export const Gradient: Story = {
  args: {
    children: "Gradient Button",
    variant: "gradient",
  },
};

export const Brand: Story = {
  args: {
    children: "Brand Button",
    variant: "brand",
  },
};

export const FAB: Story = {
  args: {
    variant: "black",
    buttonSize: "fab",
    rounded: "full",
    children: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    ),
  },
};
