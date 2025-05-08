
import DashboardLayout from "@/components/layout/DashboardLayout";
import PatentSearch from "@/components/patents/PatentSearch";

interface PatentSearchPageProps {
  isAdmin?: boolean;
}

const PatentSearchPage = ({ isAdmin = false }: PatentSearchPageProps) => {
  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Search Patents</h2>
          <p className="text-muted-foreground mt-1">
            Find patents using advanced search filters
          </p>
        </div>
        
        <PatentSearch isAdmin={isAdmin} />
      </div>
    </DashboardLayout>
  );
};

export default PatentSearchPage;
