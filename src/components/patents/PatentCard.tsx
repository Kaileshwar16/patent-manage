
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Bot, FileText, Trash, Pen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export interface PatentData {
  id: string;
  title: string;
  inventor: string;
  filingDate: string;
  status: "Pending" | "Granted" | "Rejected";
  abstract: string;
  category: string;
}

interface PatentCardProps {
  patent: PatentData;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const PatentCard = ({ patent, isAdmin = false, onDelete }: PatentCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDownload = () => {
    toast({
      title: "Download started",
      description: `Downloading Excel file for ${patent.title}`,
    });
    // In a real app, this would trigger an actual download
  };
  
  const handlePromptEngineer = () => {
    navigate(`/${isAdmin ? "admin" : "dashboard"}/prompt-engineer/${patent.id}`);
  };
  
  const handleViewDetails = () => {
    navigate(`/${isAdmin ? "admin" : "dashboard"}/patents/${patent.id}`);
  };
  
  const handleEdit = () => {
    navigate(`/admin/edit-patents/${patent.id}`);
  };
  
  const handleDelete = () => {
    setIsDeleting(true);
    // Simulate deletion process
    setTimeout(() => {
      if (onDelete) onDelete(patent.id);
      toast({
        title: "Patent deleted",
        description: `${patent.title} has been deleted successfully`,
      });
      setIsDeleting(false);
    }, 1000);
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

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-2 hover:line-clamp-none transition-all">{patent.title}</CardTitle>
            <CardDescription className="mt-1">Inventor: {patent.inventor}</CardDescription>
          </div>
          <Badge className={getStatusColor(patent.status)}>{patent.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-3">
          <span className="font-medium text-foreground">Filed:</span> {patent.filingDate}
        </div>
        <div className="text-sm mb-3">
          <Badge variant="outline" className="mr-2">{patent.category}</Badge>
        </div>
        <p className="text-sm line-clamp-3">{patent.abstract}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={handleViewDetails}
        >
          <FileText className="h-4 w-4 mr-1" />
          <span>Details</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          <span>Download</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={handlePromptEngineer}
        >
          <Bot className="h-4 w-4 mr-1" />
          <span>AI Prompt</span>
        </Button>
        
        {isAdmin && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center ml-auto"
              onClick={handleEdit}
            >
              <Pen className="h-4 w-4 mr-1" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4 mr-1" />
              <span>{isDeleting ? "Deleting..." : "Delete"}</span>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PatentCard;
