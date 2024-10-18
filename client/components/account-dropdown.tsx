"use client";

import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

const onLogout = () => {
  const cookie = require("js-cookie");
  cookie.remove("id");
  cookie.remove("jwt");
  cookie.remove("role");
  window.location.href = "/";
};

const UserDropdown = ({
  initials,
  accountDetails,
}: {
  initials: string;
  accountDetails: string;
}) => {
  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full" size="icon" variant="ghost">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{accountDetails}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem>Account Settings</DropdownMenuItem> */}
          <DropdownMenuItem onSelect={onLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { UserDropdown };
