
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PatentForm from "@/components/patents/PatentForm";
import { PatentData } from "@/components/patents/PatentCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PatentEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patent, setPatent] = useState<PatentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        console.error("Error fetching patent for edit:", err);
        setError("Failed to load patent details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPatent();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout isAdmin>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading patent details...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !patent) {
    return (
      <DashboardLayout isAdmin>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Patent Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The patent you're trying to edit doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/admin/patents')}>
            Back to Patents
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Patent</h2>
          <p className="text-muted-foreground mt-1">
            Update patent information
          </p>
        </div>
        
        <PatentForm initialData={patent} isEditing />
      </div>
    </DashboardLayout>
  );
};

export default PatentEditPage;
