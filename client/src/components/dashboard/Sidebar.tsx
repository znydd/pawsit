import { Compass, Clock, MessageCircle, Settings, ShieldCheck, LogOut, PawPrint } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOutUser } from "@/lib/auth";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isSitter: boolean;
}

export function Sidebar({ activeTab, setActiveTab, isSitter }: SidebarProps) {
    const navItems = [
        { id: "dashboard", label: "Find Sitters", icon: Compass },
        { id: "requests", label: "My Requests", icon: Clock },
        { id: "messages", label: "Inbox", icon: MessageCircle },
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
                <Link to="/sitter/dashboard">
                    <Button variant="outline" className="w-full justify-start gap-3 text-xs font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        {isSitter ? "Sitter Dashboard" : "Become a Sitter"}
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
