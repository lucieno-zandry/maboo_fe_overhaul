import { Button } from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { useUserStore } from "~/hooks/use-user"
import UserAvatar from "./user-avatar";
import { LogoutDialog } from "./logout-dialog";
import React from "react";
import { Link } from "react-router";
import useClientCodeDialogStore from "~/hooks/use-client-code-dialog-store";
import { MapPin, Package, Settings, TicketPercent } from "lucide-react";

export default function () {
    const { user } = useUserStore();
    const { setIsOpen } = useClientCodeDialogStore();

    const [logoutOpen, setLogoutOpen] = React.useState(false);

    if (!user) return;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <UserAvatar
                            avatarFallBack={user.name.substring(0, 2)}
                            avatarImageUrl={user.avatar_image?.url || undefined} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link to={'addresses'} className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                <span>Addresses</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={'settings'} className="flex items-center">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={'orders'} className="flex items-center">
                                <Package className="mr-2 h-4 w-4" />
                                <span>Orders</span>
                            </Link>
                        </DropdownMenuItem>

                        {/* Clean "Unlock" Item */}
                        {user && !user.permissions?.can_use_effective_prices && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setIsOpen(true)}
                                    className="text-primary focus:text-primary focus:bg-primary/5 cursor-pointer font-medium"
                                >
                                    <TicketPercent className="mr-2 h-4 w-4" />
                                    <span>Unlock Partner Prices</span>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={() => setLogoutOpen(true)}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
        </>
    )
}
