import { LayoutGrid, MessageCircle, Star, Image as ImageIcon, Settings, LogOut, PawPrint, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOutUser } from "@/lib/auth";

interface SitterSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function SitterSidebar({ activeTab, setActiveTab }: SitterSidebarProps) {
    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
        { id: "messages", label: "Inbox", icon: MessageCircle },
        { id: "reviews", label: "Reviews", icon: Star },
        { id: "gallery", label: "Gallery", icon: ImageIcon },
        { id: "profile", label: "Settings", icon: Settings },
    ];

    return (
        <aside className="w-64 hidden md:flex flex-col bg-background border-r border-border h-full transition-all duration-300">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-primary p-1.5 rounded-md">
                        <PawPrint className="text-primary-foreground w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        PawSit
                    </span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Button
                            key={item.id}
                            variant={activeTab === item.id ? "secondary" : "ghost"}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full justify-start gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                activeTab === item.id
                                    ? "bg-secondary text-primary font-semibold"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-primary" : "")} />
                            {item.label}
                        </Button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-border space-y-2">
                <Link to="/dashboard">
                    <Button variant="outline" className="w-full justify-start gap-3 text-xs font-semibold">
                        <User className="w-4 h-4" />
                        Switch to Owner
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    onClick={signOutUser}
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Log out</span>
                </Button>
            </div>
        </aside>
    );
}
