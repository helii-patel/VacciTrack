import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Footer } from "@/components/layout/footer";
import { ChildCard } from "@/components/children/child-card";
import { AddChildDialog } from "@/components/dialogs/add-child-dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Child } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2, PlusCircle } from "lucide-react";
import { calculateVaccinationProgress } from "@/lib/vaccination-data";

export default function ChildrenPage() {
  const { user } = useAuth();
  const [addChildDialogOpen, setAddChildDialogOpen] = useState(false);
  
  // Fetch children data
  const { data: children = [], isLoading } = useQuery<Child[]>({
    queryKey: ["/api/children"],
    queryFn: async () => {
      const res = await fetch("/api/children", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch children");
      return res.json();
    },
  });
  
  if (!user) return null;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <MobileNavigation />
          
          <div className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Page Header with Add Button */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Children</h1>
                  <p className="mt-1 text-sm text-slate-500">Manage your children's profiles and vaccination records</p>
                </div>
                <Button 
                  onClick={() => setAddChildDialogOpen(true)}
                  className="mt-4 sm:mt-0"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Child
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : children.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">No Children Added Yet</h2>
                  <p className="text-slate-600 mb-6">
                    Start by adding your child's information to create personalized vaccination schedules and reminders.
                  </p>
                  <Button onClick={() => setAddChildDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Child
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {children.map((child) => {
                    const birthDate = new Date(child.birthDate);
                    const progressPercent = calculateVaccinationProgress(birthDate);
                    
                    const progressColor = 
                      progressPercent >= 75 ? 'bg-green-500' :
                      progressPercent >= 50 ? 'bg-blue-500' : 'bg-amber-500';
                    
                    return (
                      <ChildCard 
                        key={child.id} 
                        child={child} 
                        progressPercent={progressPercent}
                        progressColor={progressColor}
                      >
                        <div className="mt-4 flex justify-between">
                          <Link href={`/children/${child.id}`}>
                            <a className="text-primary hover:text-primary-dark text-sm font-medium">
                              View Profile
                            </a>
                          </Link>
                          <Link href={`/children/${child.id}/vaccinations`}>
                            <a className="text-primary hover:text-primary-dark text-sm font-medium">
                              View Vaccinations
                            </a>
                          </Link>
                        </div>
                      </ChildCard>
                    );
                  })}
                </div>
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
