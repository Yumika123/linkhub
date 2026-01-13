import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import { Button } from "../Button/button";
import { Logo } from "../Logo/logo";
import { useState } from "react";

const meta = {
  title: "UI/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state
function SidebarWrapper(props: React.ComponentProps<typeof Sidebar>) {
  const [isOpen, setIsOpen] = useState(props.isOpen);

  return (
    <div className="relative h-screen w-full bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 z-10"
        variant="black"
      >
        Open Sidebar
      </Button>
      <Sidebar {...props} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-xl">Main Content Area</p>
      </div>
    </div>
  );
}

export const LeftSlide: Story = {
  args: {
    isOpen: false,
    children: null, // Placeholder to satisfy required props if any, though children is ReactNode
  },
  render: () => (
    <SidebarWrapper
      isOpen={false}
      position="left"
      mode="slide"
      header={
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Logo />
            <h2 className="text-xl font-bold text-white">LinkHub</h2>
          </div>
        </div>
      }
      footer={
        <div className="p-6 border-t border-white/10">
          <Button variant="glass" className="w-full">
            Footer Action
          </Button>
        </div>
      }
    >
      <div className="p-6">
        <p className="text-white/80">This is a left-sliding sidebar.</p>
        <p className="text-white/60 text-sm mt-2">
          Click outside or press Escape to close.
        </p>
      </div>
    </SidebarWrapper>
  ),
};

export const RightSlide: Story = {
  args: {
    isOpen: false,
    children: null,
  },
  render: () => (
    <SidebarWrapper
      isOpen={false}
      position="right"
      mode="slide"
      width="w-[420px]"
      header={
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-sm text-white/60 mt-1">
            Customize your preferences
          </p>
        </div>
      }
      footer={
        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1 text-white/70">
              Cancel
            </Button>
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-4">
        <div>
          <label className="text-white font-medium block mb-2">Option 1</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            placeholder="Enter value..."
          />
        </div>
        <div>
          <label className="text-white font-medium block mb-2">Option 2</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            placeholder="Enter value..."
          />
        </div>
      </div>
    </SidebarWrapper>
  ),
};

export const StaticLeft: Story = {
  args: {
    isOpen: true,
    children: null,
  },
  render: () => (
    <div className="relative h-screen w-full bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Sidebar
        isOpen={true}
        position="left"
        mode="static"
        showBackdrop={false}
        header={
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Logo />
              <h2 className="text-xl font-bold text-white">Dashboard</h2>
            </div>
          </div>
        }
        footer={
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                U
              </div>
              <div>
                <p className="text-white font-medium">User Name</p>
                <p className="text-white/60 text-sm">user@example.com</p>
              </div>
            </div>
          </div>
        }
      >
        <div className="p-6 space-y-2">
          <div className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 cursor-pointer transition-colors">
            Dashboard
          </div>
          <div className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
            Pages
          </div>
          <div className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
            Analytics
          </div>
          <div className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
            Settings
          </div>
        </div>
      </Sidebar>
      <div className="ml-64 flex items-center justify-center h-full">
        <p className="text-white text-xl">
          Main Content Area (Static Sidebar Always Visible)
        </p>
      </div>
    </div>
  ),
};

export const WithCustomContent: Story = {
  args: {
    isOpen: false,
    children: null,
  },
  render: () => (
    <SidebarWrapper
      isOpen={false}
      position="left"
      mode="slide"
      header={
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Navigation</h2>
        </div>
      }
    >
      <div className="p-6">
        <div className="space-y-4">
          <div className="bg-linear-to-r from-purple-600 to-blue-600 p-4 rounded-lg">
            <h3 className="text-white font-bold mb-2">Featured Item</h3>
            <p className="text-white/80 text-sm">
              This is a custom content area with rich formatting.
            </p>
          </div>
          <div className="space-y-2">
            {["Item 1", "Item 2", "Item 3", "Item 4"].map((item) => (
              <div
                key={item}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white cursor-pointer transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarWrapper>
  ),
};

export const NoBackdrop: Story = {
  args: {
    isOpen: false,
    children: null,
  },
  render: () => (
    <SidebarWrapper
      isOpen={false}
      position="right"
      mode="slide"
      showBackdrop={false}
      header={
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">No Backdrop</h2>
        </div>
      }
    >
      <div className="p-6">
        <p className="text-white/80">
          This sidebar doesn't show a backdrop overlay.
        </p>
      </div>
    </SidebarWrapper>
  ),
};
