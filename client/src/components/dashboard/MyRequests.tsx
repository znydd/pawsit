import { Search, MessageSquare, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useOwnerBookings, useDeleteBooking } from "@/hooks/useBooking";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface MyRequestsProps {
    setActiveTab: (tab: string) => void;
}

export function MyRequests({ setActiveTab }: MyRequestsProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: bookings, isLoading } = useOwnerBookings();
    const deleteBooking = useDeleteBooking();

    const filteredBookings = bookings?.filter(b => 
        b.sitterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to cancel this booking request?")) {
            await deleteBooking.mutateAsync(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold tracking-tight">Your Requests</h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search bookings..."
                        className="pl-9 h-9 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-3">
                {!filteredBookings || filteredBookings.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-lg bg-secondary/10">
                        <p className="text-muted-foreground text-sm">No booking requests found.</p>
                        <Button 
                            variant="link" 
                            className="text-primary mt-2"
                            onClick={() => setActiveTab("dashboard")}
                        >
                            Find a sitter to get started
                        </Button>
                    </div>
                ) : filteredBookings.map((req) => (
                    <Card key={req.id} className="border-border hover:border-primary/20 transition-all shadow-none group">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <Avatar className="w-10 h-10 rounded-md border">
                                    <AvatarImage src={req.sitterImage} />
                                    <AvatarFallback>{req.sitterName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold truncate leading-tight">
                                        {req.sitterName}
                                        <span className="text-muted-foreground font-normal text-xs ml-2">#{req.bookingCode}</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-muted-foreground uppercase tracking-tight overflow-hidden">
                                        <span className="truncate">{req.serviceType}</span>
                                        <span className="w-1 h-1 bg-border rounded-full shrink-0" />
                                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 bg-border rounded-full shrink-0" />
                                        <span className="shrink-0">{req.totalPrice}৳</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <Badge
                                    variant={!req.isAccepted ? "outline" : "secondary"}
                                    className={cn(
                                        "rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase",
                                        req.isAccepted ? "bg-emerald-100 text-emerald-700 border-none" : ""
                                    )}
                                >
                                    {req.isAccepted ? "Accepted" : "Pending"}
                                </Badge>
                                
                                {req.isAccepted ? (
                                    <Button
                                        size="sm"
                                        onClick={() => toast.info("Payment feature coming soon!")}
                                        className="h-8 px-4 text-xs font-semibold"
                                    >
                                        Pay
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setActiveTab("messages")}
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(req.id)}
                                            disabled={deleteBooking.isPending}
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        >
                                            {deleteBooking.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
