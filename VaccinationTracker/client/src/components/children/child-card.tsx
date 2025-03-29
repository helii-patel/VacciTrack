import { Child } from "@shared/schema";
import { formatChildAge, formatDate } from "@/lib/date-utils";
import { User } from "lucide-react";

interface ChildCardProps {
  child: Child;
  progressPercent: number;
  progressColor: string;
  children?: React.ReactNode;
}

export function ChildCard({ child, progressPercent, progressColor, children }: ChildCardProps) {
  const birthDate = new Date(child.birthDate);
  const ageText = formatChildAge(birthDate);
  const birthDateFormatted = formatDate(birthDate);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center mb-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <User className="text-primary text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{child.firstName} {child.lastName}</h3>
            <p className="text-sm text-slate-500">{ageText} ({birthDateFormatted})</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Vaccination Status</span>
            <span className={`font-medium ${
              progressPercent >= 75 ? 'text-green-500' :
              progressPercent >= 50 ? 'text-blue-500' : 'text-amber-500'
            }`}>
              {progressPercent}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className={`${progressColor} h-2.5 rounded-full`} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
