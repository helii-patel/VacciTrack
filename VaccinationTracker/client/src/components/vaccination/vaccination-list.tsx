import { VaccinationCard } from "@/components/vaccination/vaccination-card";
import { Vaccination } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VaccinationListProps {
  vaccinations: Vaccination[];
  childName: string;
  onSchedule?: (vaccination: Vaccination) => void;
  onMarkComplete?: (vaccination: Vaccination) => void;
}

export function VaccinationList({ 
  vaccinations, 
  childName, 
  onSchedule, 
  onMarkComplete 
}: VaccinationListProps) {
  // Separate vaccinations into upcoming and completed
  const upcomingVaccinations = vaccinations.filter(v => !v.administered);
  const completedVaccinations = vaccinations.filter(v => v.administered);
  
  // Sort upcoming by scheduled date (ascending)
  upcomingVaccinations.sort((a, b) => 
    new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );
  
  // Sort completed by administered date (descending)
  completedVaccinations.sort((a, b) => {
    const dateA = a.administeredDate ? new Date(a.administeredDate) : new Date(a.scheduledDate);
    const dateB = b.administeredDate ? new Date(b.administeredDate) : new Date(b.scheduledDate);
    return dateB.getTime() - dateA.getTime();
  });
  
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="upcoming">
          Upcoming ({upcomingVaccinations.length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({completedVaccinations.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming">
        {upcomingVaccinations.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-slate-500">No upcoming vaccinations scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingVaccinations.map((vaccination) => (
              <VaccinationCard 
                key={vaccination.id}
                vaccination={vaccination}
                childName={childName}
                onSchedule={onSchedule ? () => onSchedule(vaccination) : undefined}
                onMarkComplete={onMarkComplete ? () => onMarkComplete(vaccination) : undefined}
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="completed">
        {completedVaccinations.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-slate-500">No completed vaccinations recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedVaccinations.map((vaccination) => (
              <VaccinationCard 
                key={vaccination.id}
                vaccination={vaccination}
                childName={childName}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
