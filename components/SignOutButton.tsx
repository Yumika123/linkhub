import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button/button";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOutAction}>
      <Button
        type="submit"
        variant="ghost"
        withScale={false}
        rounded="md"
        className={className}
      >
        Sign Out
      </Button>
    </form>
  );
}
