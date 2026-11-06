"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User } from "lucide-react"
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function Header() {
  const { data: session, isPending, error } = authClient.useSession();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          switch (session?.user.role) {
            case "admin":
              redirect("/admin/login");
            case "parent":
              redirect("/parent/login");
            case "student":
              redirect("/student/login");
            case "mentor":
              redirect("/mentor/login");
          }
        },
      },
    });
  }

  return (
  <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-6">
    <SidebarTrigger className="-ml-2" />
    <div className="flex-1" />

    <div className="flex items-center gap-4 text-sm font-medium">
      {/* Notification Bell */}
      <Button variant="ghost" size="icon" className="relative rounded-full">
        <Bell className="h-5 w-5" />
        {/* Unread Indicator Badge */}
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background" />
        <span className="sr-only">Notifications</span>
      </Button>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 gap-2 px-2 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
            <span className="hidden sm:inline-block">{session?.user?.name}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border overflow-hidden">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuSeparator />
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 cursor-pointer" 
                onSelect={(e) => e.preventDefault()} // Prevents dropdown from closing and unmounting the dialog
              >
                Log out
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah anda yakin untuk logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda akan perlu masuk kembali untuk mengakses akun Anda.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleSignOut}>
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
);
}