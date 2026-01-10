"use client";

import { UserProfile, Button, Dropdown } from "@/components/ui";
import { SignOutButton } from "@/components/SignOutButton";

interface UserMenuProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <Dropdown
      trigger={
        <UserProfile
          name={user.name || "User"}
          image={user.image}
          subtitle="Linkhub"
        />
      }
    >
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

      <div className="w-full">
        <SignOutButton className="w-full justify-start text-sm font-normal text-red-300 hover:text-red-200 hover:bg-red-500/10 px-3 py-2 h-auto" />
      </div>
    </Dropdown>
  );
}
