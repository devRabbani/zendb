import LatestArticles from "@/components/home/latest-articles";
import LearningResources from "@/components/home/learning-resources";
import TipsSection from "@/components/home/tips-section";
import ToolsShowcase from "@/components/home/tools-showcase";

export default function HomePage() {
  return (
    <div className="space-y-9">
      <TipsSection />
      <ToolsShowcase />
      <LatestArticles />
      <LearningResources />
    </div>
  );
}
