import { HelpCircleIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import CopySampleBtn from "./copy-sample.btn";

export default function SchemaHelperPopup() {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger className="cursor-pointer">
        <HelpCircleIcon className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
      </HoverCardTrigger>
      <HoverCardContent>
        <>
          <p className="text-[0.8rem] leading-relaxed">
            Please enter the table structures one per paragraph, with columns
            listed on separate lines. For example:
          </p>
          <pre className="mt-2">
            <code className="text-xs whitespace-pre">
              Order{"\n"}
              id Int Primary Key {"\n"}
              userId Int references User(id){"\n"}
              total_amount Decimal
            </code>
          </pre>

          <CopySampleBtn variant="simple" />
        </>
      </HoverCardContent>
    </HoverCard>
  );
}
