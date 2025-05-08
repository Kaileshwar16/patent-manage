
import DashboardLayout from "@/components/layout/DashboardLayout";
import PatentForm from "@/components/patents/PatentForm";

interface PatentAddPageProps {
  isAdmin?: boolean;
}

const PatentAddPage = ({ isAdmin = false }: PatentAddPageProps) => {
  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Patent</h2>
          <p className="text-muted-foreground mt-1">
            Submit a new patent to the database
          </p>
        </div>
        
        <PatentForm />
      </div>
    </DashboardLayout>
  );
};

export default PatentAddPage;
