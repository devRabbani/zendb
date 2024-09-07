import Link from "next/link";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function Nav() {
  return (
    <nav>
      <div className="flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-semibold text-muted-foreground">
          DBly
        </Link>
        <div>
          <Button size="sm" variant="secondary">
            Test
          </Button>
        </div>
      </div>
      <Separator />
    </nav>
  );
}
