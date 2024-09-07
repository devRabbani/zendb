export default function ToolpageHeader({
  header,
  para,
}: {
  header: string;
  para: string;
}) {
  return (
    <section title="header" className="space-y-2">
      <h1 className="text-xl font-semibold">{header}</h1>
      <p className="text-sm font-medium max-w-3xl leading-6 text-muted-foreground">
        {para}
      </p>
    </section>
  );
}
