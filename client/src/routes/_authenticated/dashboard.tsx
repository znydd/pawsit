import { createFileRoute } from "@tanstack/react-router";
import { signOutUser } from "../../lib/auth";
import { InitialPopUpForm } from "@/components/InitialPopUpForm";
import { useOwner, useCreateOwner } from "@/hooks/useOwner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, LogOut, User, Settings } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { auth } = Route.useRouteContext();
  // const { data: owner, isPending: isOwnerLoading } = useOwner();
  const owner = {
    name: "John Doe",
    image: "https://via.placeholder.com/150",
  };
  const isOwnerLoading = false;
  const createOwner = useCreateOwner();

  const handleConfirm = (data: { name: string; image: string }) => {
    createOwner.mutate(data);
  };

  if (isOwnerLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  const showPopup = !owner;

  // Mock: will come from API later
  const isSitter = false;

  // Get user info from auth context
  const userName = auth.user?.name || "User";
  const userImage = auth.user?.image || "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <main className="h-screen bg-background overflow-hidden">
      {/* Popup */}
      {showPopup && <InitialPopUpForm onConfirm={handleConfirm} />}

      {/* Header */}
      <header className="border-b border-border/40 bg-background sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            PawSit
          </h1>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for sitters, pets..."
                className="pl-10 h-10 rounded-xl"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Sitter Button */}
            <Button variant="outline">
              {isSitter ? "Sitter Dashboard" : "Become a Sitter"}
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 focus:outline-none">
                  <span className="text-sm font-medium text-foreground hidden sm:block">
                    {userName}
                  </span>
                  <Avatar className="h-10 w-10 border-2 border-border hover:border-primary/50 transition-all cursor-pointer">
                    <AvatarImage src={userImage} alt={userName} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {auth.user?.email || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOutUser} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-4xl font-medium tracking-tight text-foreground">Welcome back</h2>
            <p className="text-muted-foreground">Here's what's happening with your pets today</p>
          </div>

        </div>
      </div>
    </main>
  );
}