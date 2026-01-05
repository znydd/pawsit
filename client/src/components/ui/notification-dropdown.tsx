import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
    useNotifications, 
    useMarkAsRead, 
    useMarkAllAsRead, 
    useClearNotifications 
} from "@/hooks/useNotification";
import { cn } from "@/lib/utils";
import type { Notification } from "@/api/endpoints/notification";

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

function getNotificationIcon(type: Notification['type']): string {
    switch (type) {
        case 'booking_accepted': return '✅';
        case 'review_received': return '⭐';
        case 'review_reply': return '💬';
        default: return '🔔';
    }
}

export function NotificationDropdown() {
    const { data: notifications = [], isLoading } = useNotifications();
    const markAsRead = useMarkAsRead();
    const markAllAsRead = useMarkAllAsRead();
    const clearAll = useClearNotifications();

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead.mutate(notification.id);
        }
    };

    const handleMarkAllAsRead = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        markAllAsRead.mutate();
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        clearAll.mutate();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {notifications.length > 0 && (
                        <div className="flex gap-1">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-xs"
                                onClick={handleMarkAllAsRead}
                                disabled={unreadCount === 0}
                            >
                                <CheckCheck className="h-3 w-3 mr-1" />
                                Mark read
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                                onClick={handleClearAll}
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Clear
                            </Button>
                        </div>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {isLoading ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        Loading...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    <ScrollArea className="h-[300px]">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex flex-col items-start gap-1 px-3 py-2.5 cursor-pointer",
                                    !notification.isRead && "bg-accent/50"
                                )}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex items-start gap-2 w-full">
                                    <span className="text-base shrink-0">
                                        {getNotificationIcon(notification.type)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "text-sm leading-tight",
                                            !notification.isRead && "font-medium"
                                        )}>
                                            {notification.content}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatTimeAgo(notification.createdAt)}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </ScrollArea>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
