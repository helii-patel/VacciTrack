import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vaccineInfoCategories, vaccineSchedule } from "@/lib/vaccination-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info } from "lucide-react";

export default function VaccineInfoPage() {
  const { user } = useAuth();
  
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
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Vaccine Information</h1>
                <p className="mt-1 text-sm text-slate-500">Learn about recommended vaccinations for your child</p>
              </div>
              
              {/* Introduction */}
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <Info className="h-8 w-8 text-primary mr-4 mt-1" />
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 mb-2">Why Vaccinations Matter</h2>
                      <p className="text-slate-600 mb-4">
                        Vaccines play a crucial role in protecting your child against serious diseases. They help develop 
                        immunity by imitating an infection, which enables the body to recognize and fight the disease in the future.
                      </p>
                      <p className="text-slate-600">
                        Following the recommended vaccination schedule ensures your child gets the right protection 
                        at the right time. Remember, vaccinating your child not only protects them but also helps 
                        prevent the spread of diseases to others in the community.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Vaccine Categories Tabs */}
              <Tabs defaultValue="infant" className="mb-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="infant">0-12 Months</TabsTrigger>
                  <TabsTrigger value="toddler">1-3 Years</TabsTrigger>
                  <TabsTrigger value="school">4+ Years</TabsTrigger>
                </TabsList>
                
                {vaccineInfoCategories.map((category, index) => (
                  <TabsContent 
                    key={index} 
                    value={
                      index === 0 ? "infant" : 
                      index === 1 ? "toddler" : "school"
                    }
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {category.vaccines.map((vaccine, vIdx) => (
                            <AccordionItem key={vIdx} value={vaccine.id}>
                              <AccordionTrigger className="text-left">
                                <div>
                                  <span className="font-medium">{vaccine.fullName}</span> 
                                  <span className="ml-2 text-sm text-slate-500">({vaccine.name})</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="pt-2 pb-4">
                                  <p className="text-slate-600 mb-4">{vaccine.description}</p>
                                  <h4 className="font-medium text-slate-900 mb-2">Recommended Doses:</h4>
                                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                                    {vaccine.doses.map((dose, dIdx) => (
                                      <li key={dIdx}>
                                        Dose {dose.doseNumber}: {dose.ageMonths === 0 ? 'At birth' : 
                                          dose.ageMonths < 12 ? `${dose.ageMonths} months` : 
                                          dose.ageMonths === 12 ? '1 year' : 
                                          dose.ageMonths < 24 ? `${dose.ageMonths} months` : 
                                          `${Math.floor(dose.ageMonths / 12)} years`}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
              
              {/* Full Vaccine Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Complete Vaccination Schedule</CardTitle>
                  <CardDescription>
                    Recommended schedule for routine vaccinations from birth through 6 years
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="border px-4 py-2 text-left text-slate-900">Vaccine</th>
                          <th className="border px-4 py-2 text-left text-slate-900">Full Name</th>
                          <th className="border px-4 py-2 text-left text-slate-900">Recommended Ages</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vaccineSchedule.map((vaccine, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                            <td className="border px-4 py-2 font-medium text-slate-900">{vaccine.name}</td>
                            <td className="border px-4 py-2 text-slate-700">{vaccine.fullName}</td>
                            <td className="border px-4 py-2 text-slate-700">
                              {vaccine.doses.map((dose, i) => (
                                <div key={i} className="mb-1 last:mb-0">
                                  <span className="font-medium">{i + 1}{getOrdinalSuffix(i + 1)} dose:</span> {
                                    dose.ageMonths === 0 ? 'At birth' : 
                                    dose.ageMonths < 12 ? `${dose.ageMonths} months` : 
                                    dose.ageMonths === 12 ? '1 year' : 
                                    dose.ageMonths < 24 ? `${dose.ageMonths} months` : 
                                    `${Math.floor(dose.ageMonths / 12)} years`
                                  }
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">
                    Note: This schedule is based on recommendations from the Centers for Disease Control and Prevention (CDC).
                    Always consult with your healthcare provider for personalized vaccination advice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Helper function to get ordinal suffix
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}
