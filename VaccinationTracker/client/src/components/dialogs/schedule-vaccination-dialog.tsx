import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Vaccination } from "@shared/schema";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ScheduleVaccinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaccination: Vaccination | Partial<Vaccination>;
  childId: number;
}

export function ScheduleVaccinationDialog({ 
  open, 
  onOpenChange, 
  vaccination, 
  childId 
}: ScheduleVaccinationDialogProps) {
  const { toast } = useToast();
  
  // Define the schema for the form
  const formSchema = z.object({
    vaccineName: z.string().min(1, "Vaccine name is required"),
    scheduledDate: z.string().refine(date => !isNaN(Date.parse(date)), { 
      message: "Valid scheduled date is required" 
    }),
    notes: z.string().optional(),
  });
  
  // Create the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vaccineName: vaccination.vaccineName || "",
      scheduledDate: vaccination.scheduledDate ? 
        new Date(vaccination.scheduledDate).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0],
      notes: vaccination.notes || "",
    },
  });
  
  // Create or update vaccination
  const vaccinationMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (vaccination.id) {
        // Update existing vaccination
        const res = await apiRequest("PUT", `/api/vaccinations/${vaccination.id}`, values);
        return res.json();
      } else {
        // Create new vaccination
        const data = { ...values, childId, administered: false };
        const res = await apiRequest("POST", `/api/children/${childId}/vaccinations`, data);
        return res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: vaccination.id 
          ? "Vaccination updated successfully" 
          : "Vaccination scheduled successfully",
      });
      
      form.reset();
      onOpenChange(false);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: [`/api/children/${childId}/vaccinations`] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${vaccination.id ? "update" : "schedule"} vaccination: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    vaccinationMutation.mutate(values);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {vaccination.id ? "Update Vaccination" : "Schedule Vaccination"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vaccineName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccine Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., DTaP 1st dose" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Add any additional notes about this vaccination"
                      className="resize-none h-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={vaccinationMutation.isPending}
              >
                {vaccinationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {vaccination.id ? "Updating..." : "Scheduling..."}
                  </>
                ) : (
                  vaccination.id ? "Update Vaccination" : "Schedule Vaccination"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
