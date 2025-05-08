
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="text-center space-y-6 max-w-3xl">
        <div className="mb-6 flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <FileText className="text-primary h-16 w-16" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Patent Spark
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Manage and analyze your patent portfolio with our advanced patent management system
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto"
          >
            Login
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/admin/patents')}
            className="w-full sm:w-auto"
          >
            Admin Dashboard
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/dashboard/patents')}
            className="w-full sm:w-auto"
          >
            User Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
