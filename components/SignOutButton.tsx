import { signOut } from "@/auth"

export function SignOutButton() {
    return (
        <form
            action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
            }}
        >
            <button
                type="submit"
                className="text-sm text-gray-600 hover:text-black hover:underline"
            >
                Sign Out
            </button>
        </form>
    )
}
