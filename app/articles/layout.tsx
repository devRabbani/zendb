import BreadcrumbHelper from "@/components/breadcrumb-helper";

export default function ArticlePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <BreadcrumbHelper pageName="Articles" />
      <h2 className="mt-5 font-semibold mb-4 text-lg border-b pb-1.5">
        Articles on Databases
      </h2>
      {children}
    </section>
  );
}
