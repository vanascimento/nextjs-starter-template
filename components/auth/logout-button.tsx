import { signOutAction } from "@/app/actions/login";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <div
      className="flex items-center space-x-2 w-full"
      onClick={async () => {
        await signOutAction();
      }}
    >
      <LogOut className="size-4 " />
      <span>Log out</span>
    </div>
  );
}
