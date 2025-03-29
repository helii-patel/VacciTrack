import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Side - Forms */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <i className="fas fa-syringe text-primary text-3xl"></i>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">VaxTrack</h1>
            <p className="mt-2 text-slate-600">Child Vaccination Reminder System</p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm isPending={loginMutation.isPending} onSubmit={loginMutation.mutate} />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm isPending={registerMutation.isPending} onSubmit={registerMutation.mutate} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right Side - Info */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-primary to-blue-500 text-white p-12">
        <div className="max-w-lg mx-auto h-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">Keep Track of Your Child's Vaccinations</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <i className="fas fa-check-circle mr-3 mt-1"></i>
              <span>Never miss an important vaccination date with automatic reminders</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle mr-3 mt-1"></i>
              <span>Track multiple children with personalized vaccination schedules</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle mr-3 mt-1"></i>
              <span>Access detailed information about each vaccine</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle mr-3 mt-1"></i>
              <span>View your complete vaccination history and upcoming appointments</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle mr-3 mt-1"></i>
              <span>Keep your family healthy with on-time vaccinations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Login Form
function LoginForm({ 
  isPending, 
  onSubmit 
}: { 
  isPending: boolean; 
  onSubmit: (data: { username: string; password: string }) => void;
}) {
  const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              type="text" 
              placeholder="Enter your username"
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// Register Form
function RegisterForm({ 
  isPending, 
  onSubmit 
}: { 
  isPending: boolean; 
  onSubmit: (data: any) => void;
}) {
  const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
  });
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
    },
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Register to start tracking your child's vaccinations</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="First name"
                {...form.register("firstName")}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Last name"
                {...form.register("lastName")}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              placeholder="Choose a username"
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Create a password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
