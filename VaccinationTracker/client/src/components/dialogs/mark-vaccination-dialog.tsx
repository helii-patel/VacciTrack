import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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

interface MarkVaccinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaccination: Vaccination;
}

export function MarkVaccinationDialog({ 
  open, 
  onOpenChange, 
  vaccination 
}: MarkVaccinationDialogProps) {
  const { toast } = useToast();
  
  // Define the schema for the form
  const formSchema = z.object({
    administeredDate: z.string().refine(date => !isNaN(Date.parse(date)), { 
      message: "Valid date is required" 
    }),
    notes: z.string().optional(),
  });
  
  // Create the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      administeredDate: new Date().toISOString().split('T')[0],
      notes: vaccination.notes || "",
    },
  });
  
  // Mark vaccination as complete
  const markCompleteMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const updateData = {
        ...values,
        administered: true,
      };
      
      const res = await apiRequest("PUT", `/api/vaccinations/${vaccination.id}`, updateData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vaccination marked as completed",
      });
      
      form.reset();
      onOpenChange(false);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: [`/api/children/${vaccination.childId}/vaccinations`] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to mark vaccination as complete: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    markCompleteMutation.mutate(values);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Mark Vaccination as Completed
          </DialogTitle>
          <DialogDescription>
            Record the date when this vaccination was administered.
          </DialogDescription>
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
            <div className="text-sm font-medium text-slate-900 mb-2">
              Vaccine: {vaccination.vaccineName}
            </div>
            
            <FormField
              control={form.control}
              name="administeredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Administration Date</FormLabel>
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
                      placeholder="Add any relevant notes about this vaccination"
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
                disabled={markCompleteMutation.isPending}
              >
                {markCompleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Mark as Completed"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
