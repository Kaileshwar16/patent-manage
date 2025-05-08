
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back to Patent Spark AI Hub",
      });

      // Redirect based on role - checking profiles for admin role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profileData?.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        }
      });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });

      // Switch back to login mode
      setIsRegister(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Please check your information and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isRegister ? "Create an Account" : "Login"}
        </CardTitle>
        <CardDescription className="text-center">
          {isRegister 
            ? "Enter your information to create an account" 
            : "Enter your credentials to access your account"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="flex">
                <div className="bg-muted flex items-center justify-center px-3 rounded-l-md border border-r-0 border-input">
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-l-none"
                  required={isRegister}
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex">
              <div className="bg-muted flex items-center justify-center px-3 rounded-l-md border border-r-0 border-input">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-l-none"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex">
              <div className="bg-muted flex items-center justify-center px-3 rounded-l-md border border-r-0 border-input">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-l-none"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : isRegister ? "Register" : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          For admin access, include "admin" in your email during registration
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
