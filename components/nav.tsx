"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import toolNames from "@/lib/toolNames";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Nav() {
  const pathname = usePathname();

  const NavItems = () => (
    <div className="grid gap-1">
      {toolNames.map((tool) => {
        const isActive = pathname === tool.path;
        const Icon = isActive ? tool.activeIcon : tool.icon;
        return (
          <DropdownMenuItem key={tool.name} asChild>
            <Link
              href={tool.path}
              className={`flex px-3 py-2 cursor-pointer ${
                isActive ? "bg-secondary" : "text-muted-foreground"
              }`}
            >
              <Icon className="mr-2 h-4 w-4" />
              {tool.name}
            </Link>
          </DropdownMenuItem>
        );
      })}
    </div>
  );

  return (
    <nav>
      <div className="flex items-center justify-between py-3">
        <Link
          href="/"
          className="text-xl font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          DBly
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 pb-2">
            <DropdownMenuLabel>All Tools</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <NavItems />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
    </nav>
  );
}
