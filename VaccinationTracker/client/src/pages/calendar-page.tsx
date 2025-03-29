import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Footer } from "@/components/layout/footer";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VaccinationCard } from "@/components/vaccination/vaccination-card";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Child, Vaccination } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/date-utils";

export default function CalendarPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Fetch children data
  const { data: children = [], isLoading: isChildrenLoading } = useQuery<Child[]>({
    queryKey: ["/api/children"],
    queryFn: async () => {
      const res = await fetch("/api/children", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch children");
      return res.json();
    },
  });
  
  // Fetch all vaccinations for all children
  const { data: allVaccinations = [], isLoading: isVaccinationsLoading } = useQuery<Vaccination[]>({
    queryKey: ["/api/vaccinations"],
    queryFn: async () => {
      // Fetch vaccinations for each child and combine them
      if (children.length === 0) return [];
      
      const vaccinationsPromises = children.map(async (child) => {
        const res = await fetch(`/api/children/${child.id}/vaccinations`, { credentials: "include" });
        if (!res.ok) throw new Error(`Failed to fetch vaccinations for child ${child.id}`);
        return res.json();
      });
      
      const vaccinationsArrays = await Promise.all(vaccinationsPromises);
      return vaccinationsArrays.flat();
    },
    enabled: children.length > 0 && !isChildrenLoading,
  });
  
  // Get vaccinations for the selected date
  const selectedDateVaccinations = allVaccinations.filter(vaccination => {
    if (!selectedDate) return false;
    
    const vaccinationDate = new Date(vaccination.scheduledDate);
    return (
      vaccinationDate.getDate() === selectedDate.getDate() &&
      vaccinationDate.getMonth() === selectedDate.getMonth() &&
      vaccinationDate.getFullYear() === selectedDate.getFullYear()
    );
  });
  
  // Mark dates with vaccinations for highlighting in calendar
  const vaccinationDates = allVaccinations.map(v => {
    const date = new Date(v.scheduledDate);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });
  
  // Custom day render function to highlight dates with vaccinations
  const dayWithVaccination = (date: Date) => {
    const dateString = date.toDateString();
    return vaccinationDates.some(d => d.toDateString() === dateString);
  };
  
  // Get child name by ID
  const getChildName = (childId: number) => {
    const child = children.find(c => c.id === childId);
    return child ? `${child.firstName} ${child.lastName}` : "Unknown Child";
  };
  
  if (!user) return null;
  
  const isLoading = isChildrenLoading || isVaccinationsLoading;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <MobileNavigation />
          
          <div className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Vaccination Calendar</h1>
                <p className="mt-1 text-sm text-slate-500">View and manage vaccination appointments</p>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Calendar */}
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle>Select Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border mx-auto"
                        modifiers={{
                          withVaccination: (date) => dayWithVaccination(date),
                        }}
                        modifiersClassNames={{
                          withVaccination: "bg-primary/20 font-bold text-primary",
                        }}
                      />
                    </CardContent>
                  </Card>
                  
                  {/* Vaccinations for selected date */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>
                        {selectedDate 
                          ? `Vaccinations for ${formatDate(selectedDate)}` 
                          : "Select a date to view vaccinations"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedDateVaccinations.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">
                          No vaccinations scheduled for this date.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {selectedDateVaccinations.map((vaccination) => (
                            <VaccinationCard 
                              key={vaccination.id}
                              vaccination={vaccination}
                              childName={getChildName(vaccination.childId)}
                              onSchedule={() => {}} // Would open scheduling dialog
                              onMarkComplete={() => {}} // Would open mark as complete dialog
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
