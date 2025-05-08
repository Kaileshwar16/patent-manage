
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { PatentData } from "./PatentCard";
import PatentCard from "./PatentCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PatentSearchProps {
  isAdmin?: boolean;
}

const PatentSearch = ({ isAdmin = false }: PatentSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [searchResults, setSearchResults] = useState<PatentData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  
  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      let query = supabase
        .from('patents')
        .select('*');
      
      // Apply filters
      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,inventor.ilike.%${searchTerm}%,abstract.ilike.%${searchTerm}%`
        );
      }
      
      if (category && category !== "all") {
        query = query.eq('category', category);
      }
      
      if (status && status !== "all") {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Transform the data from Supabase format to our PatentData format
      const formattedResults: PatentData[] = data ? data.map(patent => ({
        id: patent.id,
        title: patent.title,
        inventor: patent.inventor,
        filingDate: new Date(patent.filing_date).toISOString().split('T')[0],
        status: patent.status as "Pending" | "Granted" | "Rejected",
        abstract: patent.abstract,
        category: patent.category
      })) : [];
      
      setSearchResults(formattedResults);
    } catch (err) {
      console.error("Error searching patents:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search patents. Please try again later."
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleReset = () => {
    setSearchTerm("");
    setCategory("");
    setStatus("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleDelete = async (patentId: string) => {
    try {
      const { error } = await supabase
        .from('patents')
        .delete()
        .eq('id', patentId);
        
      if (error) {
        throw error;
      }
      
      setSearchResults(prev => prev.filter(patent => patent.id !== patentId));
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
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Advanced Patent Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Search by title, inventor, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Pharmaceutical">Pharmaceutical</SelectItem>
                    <SelectItem value="Chemical">Chemical</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Granted">Granted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>Search</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {hasSearched && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">
            Search Results: {searchResults.length} patents found
          </h3>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults.map((patent) => (
                <PatentCard 
                  key={patent.id} 
                  patent={patent} 
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">No patents match your search criteria.</p>
              <Button variant="link" onClick={handleReset}>
                Clear search filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatentSearch;
