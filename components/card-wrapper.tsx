import { cn } from "@/lib/utils";

export default function CardWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-6 border bg-card text-card-foreground shadow",
        className
      )}
    >
      {children}
    </div>
  );
}
