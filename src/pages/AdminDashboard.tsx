
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FilePlus, FileText, Search, Bot, Download, Pen, Trash } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const AdminDashboard = () => {
  const features = [
    {
      title: "Add Patent",
      description: "Submit new patents to the database",
      icon: <FilePlus className="h-8 w-8" />,
      link: "/admin/add-patent",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "View Patents",
      description: "Browse all patent submissions",
      icon: <FileText className="h-8 w-8" />,
      link: "/admin/patents",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Search Patents",
      description: "Find and filter patents by various criteria",
      icon: <Search className="h-8 w-8" />,
      link: "/admin/search",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Edit Patents",
      description: "Modify existing patent information",
      icon: <Pen className="h-8 w-8" />,
      link: "/admin/edit-patents",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "AI Prompt Engineer",
      description: "Analyze patents using AI assistance",
      icon: <Bot className="h-8 w-8" />,
      link: "/admin/prompt-engineer",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Download Reports",
      description: "Export patent data in Excel format",
      icon: <Download className="h-8 w-8" />,
      link: "/admin/patents",
      color: "bg-pink-50 text-pink-600",
    },
  ];

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground mt-2">
            Welcome to Patent Spark AI Hub. Manage, analyze, and control the patent database.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className={`rounded-full w-12 h-12 flex items-center justify-center ${feature.color}`}>
                  {feature.icon}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <p className="text-muted-foreground text-sm mb-4">
                  {feature.description}
                </p>
                <Button asChild className="w-full">
                  <Link to={feature.link}>Access</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
