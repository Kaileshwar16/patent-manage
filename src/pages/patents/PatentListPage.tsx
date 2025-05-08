
import DashboardLayout from "@/components/layout/DashboardLayout";
import PatentList from "@/components/patents/PatentList";

interface PatentListPageProps {
  isAdmin?: boolean;
}

const PatentListPage = ({ isAdmin = false }: PatentListPageProps) => {
  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patents</h2>
          <p className="text-muted-foreground mt-1">
            Browse and manage your patent portfolio
          </p>
        </div>
        
        <PatentList isAdmin={isAdmin} />
      </div>
    </DashboardLayout>
  );
};

export default PatentListPage;
