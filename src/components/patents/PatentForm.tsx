
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { PatentData } from "./PatentCard";
import { FilePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PatentFormProps {
  initialData?: PatentData;
  isEditing?: boolean;
}


const PatentForm = ({ initialData, isEditing = false }: PatentFormProps) => {
  const [patent, setPatent] = useState<Partial<PatentData>>(
    initialData || {
      title: "",
      inventor: "",
      filingDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      abstract: "",
      category: "Technology",
    }
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleChange = (field: keyof PatentData, value: string) => {
    setPatent((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Transform the patent data to match Supabase schema
      const patentData = {
        title: patent.title,
        inventor: patent.inventor,
        filing_date: patent.filingDate,
        status: patent.status,
        abstract: patent.abstract,
        category: patent.category,
      };
      
      let result;
      
      if (isEditing && patent.id) {
        // Update existing patent
        result = await supabase
          .from('patents')
          .update(patentData)
          .eq('id', patent.id);
      } else {
        // Insert new patent
        result = await supabase
          .from('patents')
          .insert([patentData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      const successMessage = isEditing 
        ? "Patent updated successfully"
        : "New patent added successfully";
        
      toast({
        title: isEditing ? "Patent updated" : "Patent added",
        description: successMessage,
      });
      
      navigate(isEditing ? "/admin/patents" : "/dashboard/patents");
    } catch (error) {
      console.error("Error saving patent:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save patent. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FilePlus className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>{isEditing ? "Edit Patent" : "Add New Patent"}</CardTitle>
            <CardDescription>
              {isEditing ? "Update the patent information below" : "Fill out the form to add a new patent"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Patent Title</Label>
            <Input
              id="title"
              placeholder="Enter the patent title"
              value={patent.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="inventor">Inventor</Label>
            <Input
              id="inventor"
              placeholder="Enter inventor name"
              value={patent.inventor}
              onChange={(e) => handleChange("inventor", e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filingDate">Filing Date</Label>
              <Input
                id="filingDate"
                type="date"
                value={patent.filingDate}
                onChange={(e) => handleChange("filingDate", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={patent.status}
                onValueChange={(value) => handleChange("status", value as "Pending" | "Granted" | "Rejected")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Granted">Granted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={patent.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Pharmaceutical">Pharmaceutical</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Chemical">Chemical</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract</Label>
            <Textarea
              id="abstract"
              placeholder="Enter patent abstract..."
              rows={5}
              value={patent.abstract}
              onChange={(e) => handleChange("abstract", e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update Patent" : "Add Patent"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatentForm;
