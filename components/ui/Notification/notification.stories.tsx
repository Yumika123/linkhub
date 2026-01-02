import type { Meta, StoryObj } from "@storybook/react";
import { Notification } from "./Notification";
import { NotificationContainer } from "./NotificationContainer";
import { useNotificationStore } from "./useNotification";
import { Button } from "../Button/button";
import React from "react";

const meta: Meta<typeof Notification> = {
  title: "UI/Notification",
  component: Notification,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "error", "warning", "info"],
    },
    title: {
      control: "text",
    },
    message: {
      control: "text",
    },
    duration: {
      control: "number",
    },
    showProgress: {
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[400px]flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Notification>;

// Basic notification stories
export const Success: Story = {
  args: {
    id: "success-1",
    variant: "success",
    title: "Success!",
    message: "Your changes have been saved successfully.",
    duration: 0, // Disable auto-dismiss for story
  },
};

export const Error: Story = {
  args: {
    id: "error-1",
    variant: "error",
    title: "Error",
    message: "Something went wrong. Please try again.",
    duration: 0,
  },
};

export const Warning: Story = {
  args: {
    id: "warning-1",
    variant: "warning",
    title: "Warning",
    message: "This action cannot be undone. Please proceed with caution.",
    duration: 0,
  },
};

export const Info: Story = {
  args: {
    id: "info-1",
    variant: "info",
    title: "Information",
    message: "Your session will expire in 5 minutes.",
    duration: 0,
  },
};

export const WithoutTitle: Story = {
  args: {
    id: "no-title-1",
    variant: "success",
    message: "This is a notification without a title.",
    duration: 0,
  },
};

export const LongMessage: Story = {
  args: {
    id: "long-1",
    variant: "info",
    title: "Detailed Information",
    message:
      "This is a longer notification message that demonstrates how the component handles multiple lines of text. It should wrap nicely and maintain good readability.",
    duration: 0,
  },
};

export const WithProgress: Story = {
  args: {
    id: "progress-1",
    variant: "success",
    title: "Auto-dismiss",
    message: "This notification will automatically dismiss in 5 seconds.",
    duration: 5000,
    showProgress: true,
  },
};

// Interactive demo with Zustand store
const InteractiveDemo = () => {
  const { success, error, warning, info, clearAll } = useNotificationStore();

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-2xl font-bold text-black mb-4">
        Interactive Notification Demo (Zustand)
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="black"
          onClick={() =>
            success("Operation completed successfully!", "Success")
          }
        >
          Show Success
        </Button>
        <Button
          variant="black"
          onClick={() => error("An error occurred!", "Error")}
        >
          Show Error
        </Button>
        <Button
          variant="black"
          onClick={() => warning("Please be careful!", "Warning")}
        >
          Show Warning
        </Button>
        <Button
          variant="black"
          onClick={() => info("Here's some information", "Info")}
        >
          Show Info
        </Button>
      </div>
      <div className="flex gap-3 mt-4">
        <Button
          variant="gradient"
          onClick={() => {
            success("First notification");
            setTimeout(() => info("Second notification"), 200);
            setTimeout(() => warning("Third notification"), 400);
          }}
        >
          Show Multiple
        </Button>
        <Button variant="danger" onClick={() => clearAll()}>
          Clear All
        </Button>
      </div>
      <NotificationContainer position="top-right" />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

// Different positions demo
const PositionDemo = () => {
  const [position, setPosition] = React.useState<
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center"
  >("top-right");

  const { info } = useNotificationStore();

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-2xl font-bold text-black mb-4">Position Demo</h2>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="black"
          buttonSize="sm"
          onClick={() => setPosition("top-left")}
        >
          Top Left
        </Button>
        <Button
          variant="black"
          buttonSize="sm"
          onClick={() => setPosition("top-center")}
        >
          Top Center
        </Button>
        <Button
          variant="black"
          buttonSize="sm"
          onClick={() => setPosition("top-right")}
        >
          Top Right
        </Button>
        <Button
          variant="black"
          buttonSize="sm"
          onClick={() => setPosition("bottom-left")}
        >
          Bottom Left
        </Button>
        <Button
          variant="black"
          buttonSize="sm"
          onClick={() => setPosition("bottom-center")}
        >
          Bottom Center
        </Button>
        <Button
          variant="black"
          buttonSize="sm"
          onClick={() => setPosition("bottom-right")}
        >
          Bottom Right
        </Button>
      </div>
      <Button
        variant="gradient"
        onClick={() =>
          info("Check the notification position!", "Position Changed")
        }
      >
        Show Notification
      </Button>
      <NotificationContainer position={position} />
    </div>
  );
};

export const Positions: Story = {
  render: () => <PositionDemo />,
};
