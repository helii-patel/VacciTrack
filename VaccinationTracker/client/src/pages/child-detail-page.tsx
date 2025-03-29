import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Footer } from "@/components/layout/footer";
import { useParams, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Child, Vaccination } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, ChevronLeft, CalendarDays, Edit, Trash2 } from "lucide-react";
import { formatDate, formatChildAge } from "@/lib/date-utils";
import { VaccinationList } from "@/components/vaccination/vaccination-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateVaccinationSchedule } from "@/lib/vaccination-data";
import { ScheduleVaccinationDialog } from "@/components/dialogs/schedule-vaccination-dialog";
import { MarkVaccinationDialog } from "@/components/dialogs/mark-vaccination-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ChildDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const childId = Number(params.id);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [markCompleteDialogOpen, setMarkCompleteDialogOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Fetch child data
  const { data: child, isLoading: isChildLoading } = useQuery<Child>({
    queryKey: [`/api/children/${childId}`],
    queryFn: async () => {
      const res = await fetch(`/api/children/${childId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch child");
      return res.json();
    },
  });
  
  // Fetch vaccinations for this child
  const { data: vaccinations = [], isLoading: isVaccinationsLoading } = useQuery<Vaccination[]>({
    queryKey: [`/api/children/${childId}/vaccinations`],
    queryFn: async () => {
      const res = await fetch(`/api/children/${childId}/vaccinations`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch vaccinations");
      return res.json();
    },
    enabled: !isChildLoading && !!child,
  });
  
  // Delete child mutation
  const deleteChildMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/children/${childId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Child profile deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/children"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      navigate("/children");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete child profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDeleteChild = () => {
    deleteChildMutation.mutate();
  };
  
  const handleScheduleVaccination = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setScheduleDialogOpen(true);
  };
  
  const handleMarkComplete = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setMarkCompleteDialogOpen(true);
  };
  
  // Generate recommended vaccinations if child data is available
  const generateRecommendedVaccinations = () => {
    if (!child) return [];
    
    const birthDate = new Date(child.birthDate);
    const recommendedSchedule = generateVaccinationSchedule(birthDate);
    
    // Filter out vaccinations that are already in the database
    return recommendedSchedule.filter(rec => {
      return !vaccinations.some(v => 
        v.vaccineName.toLowerCase() === rec.name.toLowerCase()
      );
    });
  };
  
  const isLoading = isChildLoading || isVaccinationsLoading;
  const recommendedVaccinations = generateRecommendedVaccinations();
  
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
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : child ? (
                <>
                  {/* Back button and actions */}
                  <div className="flex justify-between items-center mb-6">
                    <Link href="/children">
                      <a className="flex items-center text-sm text-primary hover:text-primary-dark">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Children
                      </a>
                    </Link>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setDeleteConfirmOpen(true)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Profile
                      </Button>
                      <Link href={`/children/${childId}/edit`}>
                        <Button variant="outline" size="sm" asChild>
                          <a>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </a>
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Child Profile Information */}
                  <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                    <div className="p-6">
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        {child.firstName} {child.lastName}
                      </h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-slate-500">Birth Date</p>
                          <p className="font-medium text-slate-900">{formatDate(child.birthDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Age</p>
                          <p className="font-medium text-slate-900">{formatChildAge(child.birthDate)}</p>
                        </div>
                        {child.gender && (
                          <div>
                            <p className="text-sm text-slate-500">Gender</p>
                            <p className="font-medium text-slate-900">{child.gender.charAt(0).toUpperCase() + child.gender.slice(1)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Vaccinations */}
                  <Card className="mb-8">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Vaccination Records</CardTitle>
                      <Link href={`/calendar`}>
                        <Button variant="outline" size="sm" asChild>
                          <a>
                            <CalendarDays className="h-4 w-4 mr-2" />
                            View Calendar
                          </a>
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      {vaccinations.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-slate-500 mb-4">No vaccination records found for this child.</p>
                          <Button onClick={() => setScheduleDialogOpen(true)}>
                            Add First Vaccination
                          </Button>
                        </div>
                      ) : (
                        <VaccinationList 
                          vaccinations={vaccinations}
                          childName={`${child.firstName} ${child.lastName}`}
                          onSchedule={handleScheduleVaccination}
                          onMarkComplete={handleMarkComplete}
                        />
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Recommended Vaccinations */}
                  {recommendedVaccinations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Recommended Vaccinations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recommendedVaccinations.map((rec, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <div className="mb-2 sm:mb-0">
                                  <h3 className="font-medium text-slate-900">{rec.fullName}</h3>
                                  <p className="text-sm text-slate-500">Recommended at {formatDate(rec.scheduledDate)}</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    // Prepare a new vaccination for scheduling
                                    const newVaccination: Partial<Vaccination> = {
                                      childId: childId,
                                      vaccineName: rec.name,
                                      scheduledDate: rec.scheduledDate.toISOString().split('T')[0],
                                      administered: false,
                                    };
                                    setSelectedVaccination(newVaccination as Vaccination);
                                    setScheduleDialogOpen(true);
                                  }}
                                >
                                  Schedule
                                </Button>
                              </div>
                              <p className="mt-2 text-sm text-slate-600">{rec.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Child Not Found</h2>
                  <p className="text-slate-600 mb-6">
                    The child profile you are looking for does not exist or you don't have permission to view it.
                  </p>
                  <Link href="/children">
                    <Button asChild>
                      <a>Return to Children</a>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Schedule Vaccination Dialog */}
      {selectedVaccination && (
        <ScheduleVaccinationDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          vaccination={selectedVaccination}
          childId={childId}
        />
      )}
      
      {/* Mark Vaccination Complete Dialog */}
      {selectedVaccination && (
        <MarkVaccinationDialog
          open={markCompleteDialogOpen}
          onOpenChange={setMarkCompleteDialogOpen}
          vaccination={selectedVaccination}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {child?.firstName}'s profile and all associated vaccination records. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteChild}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteChildMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Deleting...
                </>
              ) : (
                "Delete Profile"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
