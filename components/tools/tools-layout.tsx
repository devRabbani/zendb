import BreadcrumbHelper from "../breadcrumb-helper";

export default function ToolsLayout({
  pageName,
  header,
  para,
  children,
}: {
  pageName: string;
  header: string;
  para: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbHelper pageName={pageName} />
      <div className="space-y-6">
        <section title="header" className="space-y-2">
          <h1 className="text-xl font-semibold">{header}</h1>
          <p className="text-sm font-medium max-w-3xl leading-6 text-muted-foreground">
            {para}
          </p>
        </section>
        {children}
      </div>
    </>
  );
}
