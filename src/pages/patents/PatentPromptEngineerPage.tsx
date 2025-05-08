
import DashboardLayout from "@/components/layout/DashboardLayout";
import PatentPromptEngineer from "@/components/patents/PatentPromptEngineer";

interface PatentPromptEngineerPageProps {
  isAdmin?: boolean;
}

const PatentPromptEngineerPage = ({ isAdmin = false }: PatentPromptEngineerPageProps) => {
  return (
    <DashboardLayout isAdmin={isAdmin}>
      <PatentPromptEngineer />
    </DashboardLayout>
  );
};

export default PatentPromptEngineerPage;
