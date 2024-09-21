import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="">
      <div className="text-center mt-6 space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold">
          404: Query Not Found!
        </h1>
        <p className="text-muted-foreground text-center w-11/12 max-w-xl  mx-auto">
          Looks like the data you’re looking for has gone AWOL. Maybe it&apos;s
          in another table, or the query just timed out... 🙈
        </p>
      </div>
      <div className="mx-auto w-fit mt-16">
        <h3 className="font-semibold">Try The Following</h3>
        <ul className="list-disc text-sm sm:text-base space-y-2 mt-2 pl-4 w-fit">
          <li>Double-check your joins (they get messy, we know).</li>
          <li>Return to the homepage before the database locks you out.</li>
          <li>Or pretend this page is part of a cool database mystery!</li>
        </ul>
        <p className="mt-5 text-sm text-muted-foreground">
          *P.S. Don’t worry, no rows were harmed in the making of this error.*
        </p>
      </div>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "mx-auto block w-fit mt-4"
        )}
      >
        Go to Home
      </Link>
    </div>
  );
}
