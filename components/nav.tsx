"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import toolNames from "@/lib/toolNames";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const NavItems = () => (
    <>
      {toolNames.map((tool) => {
        const isActive = pathname === tool.path;
        const Icon = isActive ? tool.activeIcon : tool.icon;
        return (
          <Button
            key={tool.name}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              !isActive && "!text-muted-foreground"
            }`}
          >
            <Link href={tool.path}>
              <Icon className="mr-2 h-4 w-4" />
              {tool.name}
            </Link>
          </Button>
        );
      })}
    </>
  );

  return (
    <nav>
      <div className="flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-semibold">
          DBly
        </Link>
        <div>
          {/* <Button size="sm" variant="secondary">
            Test
          </Button> */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="p-3 w-60 py-4">
              <div className="flex flex-col gap-2">
                <NavItems mobile />
              </div>
            </PopoverContent>
          </Popover>
          {/* <Popover>
            <PopoverTrigger>
              <Button variant="outline">|||</Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60">
              <div>
                {toolNames.map((tool) => (
                  <Link
                    href={tool.path}
                    key={tool.name}
                    className="flex items-center gap-2 py-2 hover:bg-secondary"
                  >
                    <tool.icon className="w-4 h-4" />
                    <span>{tool.name}</span>
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover> */}
        </div>
      </div>
      <Separator />
    </nav>
  );
}
