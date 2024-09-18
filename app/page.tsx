import LatestArticles from "@/components/home/latest-articles";
import LearningResources from "@/components/home/learning-resources";
import TipsSection from "@/components/home/tips-section";
import ToolsShowcase from "@/components/home/tools-showcase";
import TipsLoading from "@/components/skletons/tips-loading";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div className="gap-9 flex flex-col">
      <Suspense fallback={<TipsLoading />}>
        <TipsSection />
      </Suspense>
      <ToolsShowcase />
      <LatestArticles />
      <LearningResources />
    </div>
  );
}
