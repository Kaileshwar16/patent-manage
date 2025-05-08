
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";
import { Home, LogIn, FileText, Search, Download, Bot, FilePlus } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export default function DashboardLayout({ children, isAdmin = false }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  const userMenuItems = [
    { icon: Home, label: "Dashboard", onClick: () => navigate(isAdmin ? "/admin" : "/dashboard") },
    { icon: FilePlus, label: "Add Patent", onClick: () => navigate(isAdmin ? "/admin/add-patent" : "/dashboard/add-patent") },
    { icon: FileText, label: "Recent Patents", onClick: () => navigate(isAdmin ? "/admin/patents" : "/dashboard/patents") },
    { icon: Search, label: "Search Patents", onClick: () => navigate(isAdmin ? "/admin/search" : "/dashboard/search") },
    { icon: Bot, label: "Prompt Engineer", onClick: () => navigate(isAdmin ? "/admin/prompt-engineer" : "/dashboard/prompt-engineer") },
  ];

  const adminMenuItems = [
    { icon: FileText, label: "Edit Patents", onClick: () => navigate("/admin/edit-patents") },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar
          className={`bg-sidebar text-sidebar-foreground transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <SidebarHeader className="p-4 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-md">
                <FileText className="text-patent-dark h-6 w-6" />
              </div>
              {sidebarOpen && <span className="font-bold text-lg">Patent Spark</span>}
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className={sidebarOpen ? "px-4 py-2" : "sr-only"}>
                Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userMenuItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        className="flex items-center w-full py-2"
                        onClick={item.onClick}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        {sidebarOpen && <span>{item.label}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  {isAdmin && (
                    <>
                      <SidebarMenuItem>
                        <div className={`my-2 border-t border-sidebar-border ${sidebarOpen ? "mx-2" : "mx-auto w-3/4"}`} />
                      </SidebarMenuItem>
                      
                      {adminMenuItems.map((item, index) => (
                        <SidebarMenuItem key={`admin-${index}`}>
                          <SidebarMenuButton
                            className="flex items-center w-full py-2"
                            onClick={item.onClick}
                          >
                            <item.icon className="h-5 w-5 mr-2" />
                            {sidebarOpen && <span>{item.label}</span>}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
              onClick={handleLogout}
            >
              <LogIn className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1">
          <header className="border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <SidebarTrigger>
                  <Button variant="ghost" size="icon">
                    <svg 
                      width="15" 
                      height="15" 
                      viewBox="0 0 15 15" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                    >
                      <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1.5 7C1.22386 7 1 7.22386 1 7.5C1 7.77614 1.22386 8 1.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H1.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" 
                        fill="currentColor" 
                        fillRule="evenodd" 
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </SidebarTrigger>
                <h1 className="text-xl font-bold ml-2">
                  {isAdmin ? "Admin Dashboard" : "User Dashboard"}
                </h1>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
