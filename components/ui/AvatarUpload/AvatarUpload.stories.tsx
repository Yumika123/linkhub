import type { Meta, StoryObj } from "@storybook/react";
import { AvatarUpload } from "./AvatarUpload";

const meta: Meta<typeof AvatarUpload> = {
  title: "UI/AvatarUpload",
  component: AvatarUpload,
  tags: ["autodocs"],
  argTypes: {
    currentAvatar: { control: "text" },
    altText: { control: "text" },
    isEditable: { control: "boolean" },
    size: { control: "select", options: ["md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof AvatarUpload>;

export const Default: Story = {
  args: {
    currentAvatar: null,
    altText: "User Name",
    isEditable: true,
    size: "lg",
    onUpload: async (file) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Uploaded", file);
    },
    onDelete: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Deleted");
    },
  },
};

export const WithImage: Story = {
  args: {
    ...Default.args,
    currentAvatar: "https://github.com/shadcn.png",
  },
};

export const ReadOnly: Story = {
  args: {
    ...WithImage.args,
    isEditable: false,
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    size: "md",
  },
};
