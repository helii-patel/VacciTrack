import { Button } from "@/components/ui/button";
import { Vaccination } from "@shared/schema";
import { formatDate, getVaccinationDueStatus } from "@/lib/date-utils";
import { AlertTriangle, Calendar } from "lucide-react";

type ExtendedVaccination = Vaccination & { childName: string };

interface UpcomingVaccinationsProps {
  vaccinations: ExtendedVaccination[];
  onSchedule: (vaccination: ExtendedVaccination) => void;
}

export function UpcomingVaccinations({ vaccinations, onSchedule }: UpcomingVaccinationsProps) {
  if (!vaccinations.length) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Vaccinations</h2>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-slate-500">No upcoming vaccinations in the next 30 days.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Vaccinations</h2>
      <div className="bg-white shadow rounded-lg divide-y divide-slate-200">
        {vaccinations.map((vaccination) => (
          <VaccinationItem 
            key={vaccination.id} 
            vaccination={vaccination} 
            onSchedule={() => onSchedule(vaccination)} 
          />
        ))}
      </div>
    </div>
  );
}

interface VaccinationItemProps {
  vaccination: ExtendedVaccination;
  onSchedule: () => void;
}

function VaccinationItem({ vaccination, onSchedule }: VaccinationItemProps) {
  const dueStatus = getVaccinationDueStatus(vaccination.scheduledDate);
  
  const isOverdue = dueStatus.status === 'overdue';
  const icon = isOverdue ? AlertTriangle : Calendar;
  const bgColor = isOverdue ? 'bg-red-50' : 'bg-amber-50';
  const iconColor = isOverdue ? 'text-red-500' : 'text-amber-500';
  
  return (
    <div className="p-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-2 sm:mb-0">
          <div className="flex items-center">
            <div className="mr-3 flex-shrink-0">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${bgColor}`}>
                {icon({ className: iconColor })}
              </span>
            </div>
            <div>
              <p className="font-medium text-slate-900">{vaccination.vaccineName}</p>
              <p className="text-sm text-slate-500">{vaccination.childName}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:items-end">
          <span className={`inline-flex items-center rounded-full ${dueStatus.color} px-2.5 py-0.5 text-xs font-medium`}>
            {dueStatus.text}
          </span>
          <span className="mt-1 text-xs text-slate-500">{formatDate(vaccination.scheduledDate)}</span>
          <div className="mt-2">
            <Button 
              variant="link" 
              className="text-sm text-primary p-0 h-auto"
              onClick={onSchedule}
            >
              Schedule Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
