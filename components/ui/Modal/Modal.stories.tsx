import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "../Button/button";

const meta: Meta<typeof Modal> = {
  title: "UI/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Glass: Story = {
  args: {
    isOpen: true,
    title: "Modal Title",
    description: "This is a description for the modal window.",
    children: (
      <div className="space-y-4">
        <p className="text-white">Modal content goes here.</p>
        <div className="flex gap-3">
          <Button variant="gradient" className="flex-1">
            Confirm
          </Button>
          <Button variant="secondary" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    ),
  },
};
