import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_REQUESTS } from "./dashboard-data";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MyRequestsProps {
    setActiveTab: (tab: string) => void;
}

export function MyRequests({ setActiveTab }: MyRequestsProps) {
    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold tracking-tight">Your Requests</h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search bookings..."
                        className="pl-9 h-9 text-sm"
                    />
                </div>
            </div>

            <div className="space-y-3">
                {MOCK_REQUESTS.map((req) => (
                    <Card key={req.id} className="border-border hover:border-primary/20 transition-all shadow-none">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <Avatar className="w-10 h-10 rounded-md border">
                                    <AvatarImage src={req.avatar} />
                                    <AvatarFallback>{req.sitterName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold truncate leading-tight">{req.sitterName}</p>
                                    <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-muted-foreground uppercase tracking-tight overflow-hidden">
                                        <span className="truncate">{req.pet}</span>
                                        <span className="w-1 h-1 bg-border rounded-full shrink-0" />
                                        <span>{req.dates}</span>
                                        <span className="w-1 h-1 bg-border rounded-full shrink-0" />
                                        <span className="shrink-0">{req.total}৳</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <Badge
                                    variant={req.status === "Pending" ? "outline" : "secondary"}
                                    className="rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase"
                                >
                                    {req.status}
                                </Badge>
                                {req.status === "Accepted" ? (
                                    <Button
                                        size="sm"
                                        onClick={() => toast.info("Payment feature coming soon!")}
                                        className="h-8 px-4 text-xs font-semibold"
                                    >
                                        Pay
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setActiveTab("messages")}
                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
