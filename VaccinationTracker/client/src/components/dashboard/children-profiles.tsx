import { Button } from "@/components/ui/button";
import { Child } from "@shared/schema";
import { formatChildAge } from "@/lib/date-utils";
import { calculateVaccinationProgress } from "@/lib/vaccination-data";
import { Link } from "wouter";
import { ChildCard } from "@/components/children/child-card";
import { PlusCircle } from "lucide-react";

interface ChildrenProfilesProps {
  children: Child[];
  onAddChild: () => void;
}

export function ChildrenProfiles({ children, onAddChild }: ChildrenProfilesProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Your Children</h2>
        <Button 
          variant="link" 
          className="text-sm font-medium text-primary p-0 h-auto flex items-center"
          onClick={onAddChild}
        >
          <PlusCircle className="mr-1 h-4 w-4" />
          Add Child
        </Button>
      </div>
      
      {children.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-slate-500 mb-4">You haven't added any children yet.</p>
          <Button onClick={onAddChild}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Child
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <ChildProfileCard key={child.id} child={child} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ChildProfileCardProps {
  child: Child;
}

function ChildProfileCard({ child }: ChildProfileCardProps) {
  const birthDate = new Date(child.birthDate);
  const ageText = formatChildAge(birthDate);
  const progressPercent = calculateVaccinationProgress(birthDate);
  
  const progressColor = 
    progressPercent >= 75 ? 'bg-green-500' :
    progressPercent >= 50 ? 'bg-blue-500' : 'bg-amber-500';
  
  return (
    <ChildCard child={child} progressPercent={progressPercent} progressColor={progressColor}>
      <div className="mt-4">
        <Link href={`/children/${child.id}`}>
          <a className="text-primary hover:text-primary-dark text-sm font-medium">
            View Complete Profile →
          </a>
        </Link>
      </div>
    </ChildCard>
  );
}
