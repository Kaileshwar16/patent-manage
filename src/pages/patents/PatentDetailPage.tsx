
import DashboardLayout from "@/components/layout/DashboardLayout";
import PatentDetail from "@/components/patents/PatentDetail";

interface PatentDetailPageProps {
  isAdmin?: boolean;
}

const PatentDetailPage = ({ isAdmin = false }: PatentDetailPageProps) => {
  return (
    <DashboardLayout isAdmin={isAdmin}>
      <PatentDetail isAdmin={isAdmin} />
    </DashboardLayout>
  );
};

export default PatentDetailPage;
