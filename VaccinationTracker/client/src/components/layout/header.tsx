import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";

export function Header() {
  const { user, logoutMutation } = useAuth();
  
  if (!user) return null;
  
  const userInitials = `${user.firstName[0]}${user.lastName[0]}`;
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <i className="fas fa-syringe text-primary text-xl mr-2"></i>
              <Link href="/">
                <span className="font-bold text-xl text-primary cursor-pointer">VaxTrack</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <UserMenu 
              userInitials={userInitials} 
              userName={`${user.firstName} ${user.lastName}`}
              onLogout={() => logoutMutation.mutate()}
              isLoggingOut={logoutMutation.isPending}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

type UserMenuProps = {
  userInitials: string;
  userName: string;
  onLogout: () => void;
  isLoggingOut: boolean;
};

function UserMenu({ userInitials, userName, onLogout, isLoggingOut }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex text-sm rounded-full focus:outline-none">
          <span className="sr-only">Open user menu</span>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            {userInitials}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{userName}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <div className="w-full cursor-pointer">Account Settings</div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onLogout}
          disabled={isLoggingOut}
          className="cursor-pointer"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging out...
            </>
          ) : (
            "Log out"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
