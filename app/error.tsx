"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="">
      <div className="text-center mt-6 space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Uh-oh! Something went wrong.
        </h1>
        <p className="text-muted-foreground text-center w-11/12 max-w-xl  mx-auto">
          It looks like our app hit a snag—whether it’s a syntax error, a
          missing table, or just some rogue semicolon, we’ve got this under
          control!
        </p>
      </div>
      <div className="mx-auto w-fit mt-14 max-w-xl">
        <h3 className="font-semibold">What you can do</h3>
        <ul className="list-disc text-sm sm:text-base space-y-2 mt-2 pl-4 w-fit">
          <li>Try refreshing the page.</li>
          <li>
            Go back and double-check your inputs (because everyone loves
            debugging!).
          </li>
          <li>
            Report this error if it persists—our logs are standing by to
            investigate.
          </li>
        </ul>
        <p className="mt-5 text-sm text-muted-foreground">
          Error details see console log (Only if you want to see the gritty code
          stuff!)
        </p>
      </div>
      <div className="mt-5 space-x-3 mx-auto w-fit">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "secondary" }), "w-36")}
        >
          Back to safety
        </Link>
        <Button onClick={() => reset()} variant="secondary" className="w-36">
          Try Again!
        </Button>
      </div>
    </div>
  );
}
