
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// Page imports
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatentListPage from "./pages/patents/PatentListPage";
import PatentDetailPage from "./pages/patents/PatentDetailPage";
import PatentAddPage from "./pages/patents/PatentAddPage";
import PatentEditPage from "./pages/patents/PatentEditPage";
import PatentSearchPage from "./pages/patents/PatentSearchPage";
import PatentPromptEngineerPage from "./pages/patents/PatentPromptEngineerPage";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  isAdmin = false, 
  user 
}: { 
  children: React.ReactNode; 
  isAdmin?: boolean; 
  user: User | null;
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAuthorized(false);
        return;
      }

      if (!isAdmin) {
        setIsAuthorized(true);
        return;
      }

      // Check if user is an admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      setIsAuthorized(profile?.role === 'admin');
    };

    checkAdminStatus();
  }, [user, isAdmin]);

  if (isAuthorized === null) return null; // Loading state
  
  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin && !isAuthorized) return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute user={user}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/patents" element={
              <ProtectedRoute user={user}>
                <PatentListPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/patents/:id" element={
              <ProtectedRoute user={user}>
                <PatentDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/add-patent" element={
              <ProtectedRoute user={user}>
                <PatentAddPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/search" element={
              <ProtectedRoute user={user}>
                <PatentSearchPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/prompt-engineer" element={
              <ProtectedRoute user={user}>
                <PatentPromptEngineerPage isAdmin={false} />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/prompt-engineer/:id" element={
              <ProtectedRoute user={user}>
                <PatentPromptEngineerPage isAdmin={false} />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute user={user} isAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/patents" element={
              <ProtectedRoute user={user} isAdmin={true}>
                <PatentListPage isAdmin={true} />
              </ProtectedRoute>
            } />
            <Route path="/admin/patents/:id" element={
              <ProtectedRoute user={user} isAdmin={true}>
                <PatentDetailPage isAdmin={true} />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-patent" element={
              <ProtectedRoute user={user} isAdmin={true}>
                <PatentAddPage isAdmin={true} />
              </ProtectedRoute>
            } />
            <Route path="/admin/edit-patents" element={
              <ProtectedRoute user={user} isAdmin={true}>
                <PatentListPage isAdmin={true} />
              </ProtectedRoute>
            } />
            <Route path="/admin/edit-patents/:id" element={
              <ProtectedRoute user={user} isAdmin={true}>
                <PatentEditPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/search" element={
              <ProtectedRoute user={user} isAdmin={true}>
                <PatentSearchPage isAdmin={true} />
              </ProtectedRoute>
            } />
            <Route path="/admin/prompt-engineer" element={
              <ProtectedRoute user={user} isAdmin={true}>
                <PatentPromptEngineerPage isAdmin={true} />
              </ProtectedRoute>
            } />
            <Route path="/admin/prompt-engineer/:id" element={
              <ProtectedRoute user={user} isAdmin={true}>
                <PatentPromptEngineerPage isAdmin={true} />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
