
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { PatentData } from "./PatentCard";
import { Download, Bot, ArrowLeft, Pen, Trash, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PatentDetailProps {
  isAdmin?: boolean;
}

const PatentDetail = ({ isAdmin = false }: PatentDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patent, setPatent] = useState<PatentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchPatent() {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('patents')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform the data from Supabase format to our PatentData format
          const formattedPatent: PatentData = {
            id: data.id,
            title: data.title,
            inventor: data.inventor,
            filingDate: new Date(data.filing_date).toISOString().split('T')[0],
            status: data.status as "Pending" | "Granted" | "Rejected",
            abstract: data.abstract,
            category: data.category
          };
          
          setPatent(formattedPatent);
        } else {
          setError("Patent not found");
        }
      } catch (err) {
        console.error("Error fetching patent:", err);
        setError("Failed to load patent details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPatent();
  }, [id]);
  
  const handleDownload = () => {
    toast({
      title: "Download started",
      description: `Downloading Excel file for ${patent?.title}`,
    });
    // In a real app, this would trigger an actual download
  };
  
  const handlePromptEngineer = () => {
    navigate(`/${isAdmin ? "admin" : "dashboard"}/prompt-engineer/${id}`);
  };
  
  const handleEdit = () => {
    navigate(`/admin/edit-patents/${id}`);
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('patents')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Patent deleted",
        description: `${patent?.title} has been deleted successfully`,
      });
      
      navigate(`/${isAdmin ? "admin" : "dashboard"}/patents`);
    } catch (err) {
      console.error("Error deleting patent:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete patent. Please try again later."
      });
      setIsDeleting(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Granted":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading patent details...</span>
      </div>
    );
  }
  
  if (error || !patent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Patent Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The patent you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle className="text-2xl">{patent.title}</CardTitle>
              <CardDescription className="mt-2 text-base">Inventor: {patent.inventor}</CardDescription>
            </div>
            <Badge className={`${getStatusColor(patent.status)} text-sm px-3 py-1`}>
              {patent.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Filing Date:</span>
              <p>{patent.filingDate}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Category:</span>
              <p>{patent.category}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Abstract</h3>
            <p className="text-sm">{patent.abstract}</p>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium text-lg mb-4">Documents & Actions</h3>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="flex items-center" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Excel
              </Button>
              <Button variant="outline" className="flex items-center" onClick={handlePromptEngineer}>
                <Bot className="h-4 w-4 mr-2" />
                AI Prompt Engineer
              </Button>
            </div>
          </div>
        </CardContent>
        
        {isAdmin && (
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" className="flex items-center" onClick={handleEdit}>
              <Pen className="h-4 w-4 mr-2" />
              Edit Patent
            </Button>
            <Button
              variant="destructive"
              className="flex items-center"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Patent"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PatentDetail;
