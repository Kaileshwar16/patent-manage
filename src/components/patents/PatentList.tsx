
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { PatentData } from "./PatentCard";
import PatentCard from "./PatentCard";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PatentListProps {
  isAdmin?: boolean;
}

const PatentList = ({ isAdmin = false }: PatentListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patents, setPatents] = useState<PatentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchPatents() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('patents')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        // Transform the data from Supabase format to our PatentData format
        const formattedPatents: PatentData[] = data.map(patent => ({
          id: patent.id,
          title: patent.title,
          inventor: patent.inventor,
          filingDate: new Date(patent.filing_date).toISOString().split('T')[0],
          status: patent.status as "Pending" | "Granted" | "Rejected",
          abstract: patent.abstract,
          category: patent.category
        }));
        
        setPatents(formattedPatents);
      } catch (err) {
        console.error("Error fetching patents:", err);
        setError("Failed to load patents. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load patents. Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPatents();
  }, [toast]);
  
  const handleDelete = async (patentId: string) => {
    try {
      const { error } = await supabase
        .from('patents')
        .delete()
        .eq('id', patentId);
        
      if (error) {
        throw error;
      }
      
      setPatents(prev => prev.filter(patent => patent.id !== patentId));
      toast({
        title: "Patent deleted",
        description: "Patent has been successfully deleted.",
      });
    } catch (err) {
      console.error("Error deleting patent:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete patent. Please try again later."
      });
    }
  };
  
  const filteredPatents = patents.filter((patent) => {
    const searchString = searchTerm.toLowerCase();
    return (
      patent.title.toLowerCase().includes(searchString) ||
      patent.inventor.toLowerCase().includes(searchString) ||
      patent.abstract.toLowerCase().includes(searchString) ||
      patent.category.toLowerCase().includes(searchString)
    );
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading patents...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="max-w-md mx-auto md:mx-0">
        <Input
          placeholder="Search patents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPatents.length > 0 ? (
          filteredPatents.map((patent) => (
            <PatentCard 
              key={patent.id} 
              patent={patent} 
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-2 py-12 text-center">
            <p className="text-lg text-muted-foreground">
              {searchTerm
                ? "No patents match your search criteria"
                : "No patents found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatentList;
