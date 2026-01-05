import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";

interface HeaderProps {
    activeTab: string;
    userName: string;
    userImage: string;
    userInitials: string;
}

export function Header({ activeTab, userName, userImage, userInitials }: HeaderProps) {
    const titles: Record<string, string> = {
        dashboard: "Find Sitters",
        requests: "My Requests",
        messages: "Inbox",
        profile: "Settings",
    };

    return (
        <header className="bg-background/80 backdrop-blur-sm sticky top-0 px-6 py-4 flex justify-between items-center z-40 border-b border-border">
            <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
                {titles[activeTab]}
            </h2>
            <div className="flex items-center gap-3">
                <NotificationDropdown />
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-foreground leading-none">{userName}</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">Pet Owner</p>
                </div>
                <Avatar className="w-8 h-8 rounded-md border shadow-sm">
                    <AvatarImage src={userImage} />
                    <AvatarFallback className="text-[10px]">{userInitials}</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}

