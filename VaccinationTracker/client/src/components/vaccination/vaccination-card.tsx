import { Vaccination } from "@shared/schema";
import { formatDate, getVaccinationDueStatus } from "@/lib/date-utils";
import { AlertTriangle, Calendar, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VaccinationCardProps {
  vaccination: Vaccination;
  childName: string;
  onSchedule?: () => void;
  onMarkComplete?: () => void;
}

export function VaccinationCard({ 
  vaccination, 
  childName, 
  onSchedule, 
  onMarkComplete 
}: VaccinationCardProps) {
  const dueStatus = getVaccinationDueStatus(vaccination.scheduledDate);
  const isAdministered = vaccination.administered;
  
  let statusIcon, statusBgColor, statusIconColor;
  
  if (isAdministered) {
    statusIcon = CheckCircle;
    statusBgColor = 'bg-green-50';
    statusIconColor = 'text-green-500';
  } else if (dueStatus.status === 'overdue') {
    statusIcon = AlertTriangle;
    statusBgColor = 'bg-red-50';
    statusIconColor = 'text-red-500';
  } else {
    statusIcon = Calendar;
    statusBgColor = 'bg-amber-50';
    statusIconColor = 'text-amber-500';
  }
  
  const Icon = statusIcon;
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-2 sm:mb-0">
            <div className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${statusBgColor}`}>
                  <Icon className={statusIconColor} />
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-900">{vaccination.vaccineName}</p>
                <p className="text-sm text-slate-500">{childName}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:items-end">
            {isAdministered ? (
              <Badge variant="outline" className="text-green-500 bg-green-50 border-green-200">
                Administered
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className={dueStatus.color}
              >
                {dueStatus.text}
              </Badge>
            )}
            <span className="mt-1 text-xs text-slate-500">
              {isAdministered 
                ? `Administered on ${formatDate(vaccination.administeredDate || vaccination.scheduledDate)}` 
                : `Scheduled for ${formatDate(vaccination.scheduledDate)}`}
            </span>
            {!isAdministered && (
              <div className="mt-2 flex gap-2">
                {onSchedule && (
                  <Button 
                    variant="link" 
                    className="text-sm text-primary p-0 h-auto"
                    onClick={onSchedule}
                  >
                    Schedule
                  </Button>
                )}
                {onMarkComplete && (
                  <Button 
                    variant="link" 
                    className="text-sm text-green-500 p-0 h-auto"
                    onClick={onMarkComplete}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        {vaccination.notes && (
          <div className="mt-3 text-sm text-slate-600 border-t border-slate-100 pt-3">
            <p className="font-medium text-slate-700">Notes:</p>
            <p>{vaccination.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
