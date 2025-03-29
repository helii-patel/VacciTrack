import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users, 
  Calendar, 
  BookOpen, 
  Settings, 
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  
  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/children", label: "Children", icon: Users },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/vaccine-info", label: "Vaccine Info", icon: BookOpen },
    { href: "/settings", label: "Settings", icon: Settings },
  ];
  
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-slate-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={cn(
                        isActive
                          ? "bg-slate-100 text-primary"
                          : "text-slate-600 hover:bg-slate-100 hover:text-primary",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      )}
                    >
                      <Icon
                        className={cn(
                          isActive
                            ? "text-primary"
                            : "text-slate-400 group-hover:text-primary",
                          "mr-3 flex-shrink-0 h-5 w-5"
                        )}
                      />
                      {item.label}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
