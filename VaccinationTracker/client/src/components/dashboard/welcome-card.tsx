import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { PlusCircle } from "lucide-react";

interface WelcomeCardProps {
  firstName: string;
  upcomingCount: number;
  onAddChild: () => void;
}

export function WelcomeCard({ firstName, upcomingCount, onAddChild }: WelcomeCardProps) {
  return (
    <div className="mb-6 bg-gradient-to-r from-primary to-blue-500 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Welcome, {firstName}!</h2>
        <p className="text-sm text-white/90">
          You have {upcomingCount} upcoming vaccinations in the next 30 days.
        </p>
        <div className="mt-4">
          <Button 
            variant="secondary" 
            onClick={onAddChild}
            className="bg-white text-primary hover:bg-slate-100"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Child
          </Button>
        </div>
      </div>
    </div>
  );
}
