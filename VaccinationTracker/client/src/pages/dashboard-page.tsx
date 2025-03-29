import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Footer } from "@/components/layout/footer";
import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { UpcomingVaccinations } from "@/components/dashboard/upcoming-vaccinations";
import { ChildrenProfiles } from "@/components/dashboard/children-profiles";
import { VaccineInformation } from "@/components/dashboard/vaccine-information";
import { AddChildDialog } from "@/components/dialogs/add-child-dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Child, Vaccination } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addChildDialogOpen, setAddChildDialogOpen] = useState(false);
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return res.json();
    },
  });
  
  // Fetch children data
  const { data: children = [], isLoading: isChildrenLoading } = useQuery<Child[]>({
    queryKey: ["/api/children"],
    queryFn: async () => {
      const res = await fetch("/api/children", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch children");
      return res.json();
    },
  });
  
  const handleScheduleVaccination = (vaccination: Vaccination & { childName: string }) => {
    // In a real app, this would open a scheduling dialog or redirect to a scheduling page
    toast({
      title: "Schedule Vaccination",
      description: `You're scheduling ${vaccination.vaccineName} for ${vaccination.childName}`,
    });
  };
  
  if (!user) return null;
  
  const isLoading = isDashboardLoading || isChildrenLoading;
  
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
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">Manage your children's vaccination schedules</p>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Welcome Card */}
                  <WelcomeCard 
                    firstName={dashboardData?.user?.firstName || user.firstName} 
                    upcomingCount={dashboardData?.upcomingVaccinations?.length || 0}
                    onAddChild={() => setAddChildDialogOpen(true)}
                  />
                  
                  {/* Upcoming Vaccinations */}
                  <UpcomingVaccinations 
                    vaccinations={dashboardData?.upcomingVaccinations || []}
                    onSchedule={handleScheduleVaccination}
                  />
                  
                  {/* Children Profiles */}
                  <ChildrenProfiles 
                    children={children}
                    onAddChild={() => setAddChildDialogOpen(true)}
                  />
                  
                  {/* Vaccine Information */}
                  <VaccineInformation />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Add Child Dialog */}
      <AddChildDialog 
        open={addChildDialogOpen}
        onOpenChange={setAddChildDialogOpen}
        userId={user.id}
      />
    </div>
  );
}
