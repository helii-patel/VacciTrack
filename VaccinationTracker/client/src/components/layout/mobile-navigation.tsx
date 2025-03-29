import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users, 
  Calendar, 
  BookOpen
} from "lucide-react";

export function MobileNavigation() {
  const [location] = useLocation();
  
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/children", label: "Children", icon: Users },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/vaccine-info", label: "Info", icon: BookOpen },
  ];
  
  return (
    <div className="md:hidden bg-white border-b border-slate-200">
      <div className="grid grid-cols-4 text-xs font-medium text-center text-slate-600">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "py-4 inline-flex flex-col items-center",
                  isActive && "border-b-2 border-primary text-primary"
                )}
              >
                <Icon
                  className={cn(
                    "mb-1 text-sm h-4 w-4",
                    isActive ? "text-primary" : "text-slate-400"
                  )}
                />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
