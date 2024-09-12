import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { PiChecks } from "react-icons/pi";
import { SAMPLE_SCHEMA } from "@/lib/constants";
import type { SchemaType } from "@/lib/types";

export default function CopySampleBtn({
  variant = "prisma",
}: {
  variant?: SchemaType;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(SAMPLE_SCHEMA[variant]);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 7000);
      } else {
        throw new Error("Navigator not found");
      }
    } catch (error: any) {
      toast.error("Unable to copy, Something went wrong");
      console.log("Error copy", error?.message);
    }
  };
  return (
    <Button
      onClick={handleCopy}
      disabled={copied}
      variant={copied ? "secondary" : "outline"}
      className="mt-5 w-[9.3rem]"
      size="sm"
    >
      {copied ? (
        <>
          <PiChecks className="mr-1.5 -ml-2" /> Copied
        </>
      ) : (
        "Copy Sample Schema"
      )}
    </Button>
  );
}
