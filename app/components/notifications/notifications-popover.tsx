import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Bell } from "lucide-react";
import NotificationsSkeleton from "./notifications-skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "~/lib/utils";
import NotificationsEmpty from "./notifications-empty";
import { Button } from "../ui/button";
import { ShipmentItem, SystemItem, TransactionItem } from "./notification-item";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import appNavigate from "~/lib/app-navigate";

export type NotificationsPopoverProps = {
    notifications: AppNotification[] | null;
    unreadCount: number;
    onMarkAllAsRead?: () => void;
    onRemove?: (id: string) => Promise<void>;
    handleAction?: (n: AppNotification) => void;
    t: TFunction,
};

export function NotificationsPopover({
    unreadCount,
    notifications,
    onMarkAllAsRead,
    onRemove,
    handleAction,
    t
}: NotificationsPopoverProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    {!!unreadCount && (
                        <div className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-background px-1 animate-in zoom-in">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </div>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-96 p-0 shadow-2xl">
                <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/20">
                    <h4 className="text-sm font-semibold text-foreground">{t('common:notifications')}</h4>
                    {unreadCount > 0 && (
                        <button
                            onClick={onMarkAllAsRead}
                            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            {t('common:markAllAsRead')}
                        </button>
                    )}
                </div>

                <ScrollArea className="h-[450px]">
                    {!notifications && <NotificationsSkeleton />}

                    {notifications?.length === 0 && <NotificationsEmpty />}

                    <div className="flex flex-col">
                        {notifications?.map((n) => (
                            <div
                                key={n.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleAction?.(n)}
                                className={cn(
                                    "relative w-full text-left px-4 py-4 transition-all hover:bg-muted/50 border-b last:border-0 cursor-pointer",
                                    !n.read_at && "bg-blue-50/30 dark:bg-blue-900/10"
                                )}
                            >
                                {n.data.notification_type === "transaction" && (
                                    <TransactionItem
                                        data={n.data}
                                        isUnread={!n.read_at}
                                        onRemove={() => onRemove?.(n.id)}
                                    />
                                )}

                                {n.data.notification_type === "shipment" && (
                                    <ShipmentItem
                                        data={n.data}
                                        isUnread={!n.read_at}
                                        onRemove={() => onRemove?.(n.id)}
                                    />
                                )}

                                {n.data.notification_type === "system" && (
                                    <SystemItem data={n.data} />
                                )}

                                <div className="mt-2 flex items-center gap-2">
                                    <time className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                                        {new Date(n.created_at).toLocaleDateString(undefined, {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </time>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="border-t p-2 bg-muted/5">
                    <Button variant="ghost" className="w-full text-xs h-9 justify-center font-medium" onClick={() => appNavigate(`/${notifications}`)}>
                        {t('common:viewAllActivity')}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
export default function ({ onMarkAsRead, ...props }: Omit<NotificationsPopoverProps, "lang" | "navigate" | "handleAction" | 't'> & { onMarkAsRead?: (id: string) => void }) {
    const { t } = useTranslation();

    const handleAction = (n: AppNotification) => {
        onMarkAsRead?.(n.id);

        // 2. Handle Navigation based on type
        if (n.data.notification_type === "transaction" || n.data.notification_type === "shipment") {
            appNavigate(`/orders/${n.data.order_uuid}`);
        }
    };

    return <NotificationsPopover
        handleAction={handleAction}
        t={t} {...props} />
}