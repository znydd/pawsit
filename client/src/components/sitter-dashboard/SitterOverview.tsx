import { Bell, Star, Edit3, Check, CalendarCheck, MessageCircle, Eye, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function SitterOverview() {
    const [isAvailable, setIsAvailable] = useState(true);
    const [isPriceEditing, setIsPriceEditing] = useState(false);
    const [dailyCharge, setDailyCharge] = useState(1200);
    const [bookingTab, setBookingTab] = useState<"requests" | "accepted">("requests");

    const mockRequests = [
        { id: 1, name: 'Abid R.', pet: 'Bruno', type: 'Golden Retriever', duration: '3 Days', seed: 'Bruno' },
        { id: 2, name: 'Mustakim M.', pet: 'Leo', type: 'Persian Cat', duration: '1 Day', seed: 'Leo' }
    ];

    const mockAccepted = [
        { id: 3, name: 'Abidur R.', pet: 'Luna', type: 'Siamese Cat', status: 'Upcoming', date: 'Dec 28-30' },
        { id: 4, name: 'Mozahedul H.', pet: 'Rex', type: 'Labrador', status: 'Active', date: 'Dec 21-23' }
    ];

    const handleToggleAvailability = (checked: boolean) => {
        setIsAvailable(checked);
        toast.success(checked ? "Now Accepting Pets" : "Host Offline");
    };

    const handlePriceSave = () => {
        setIsPriceEditing(false);
        toast.success(`Charge synced: ${dailyCharge} ৳`);
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Top Controls: Visibility & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border shadow-sm flex flex-row items-center p-6 bg-background relative overflow-hidden group">
                    <Eye className="absolute -left-2 -bottom-2 w-20 h-20 text-muted-foreground/10 -rotate-12 group-hover:text-primary/10 transition-colors duration-500" />
                    <div className="flex-1" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="text-right">
                            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Visibility</h3>
                            <p className="text-sm font-bold text-foreground flex items-center justify-end gap-2">
                                {isAvailable ? "Accepting Pets" : "Host Offline"}
                                {isAvailable && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                            </p>
                        </div>
                        <Switch
                            checked={isAvailable}
                            onCheckedChange={handleToggleAvailability}
                            className="scale-125 data-[state=unchecked]:bg-red-700/80 data-[state=unchecked]:border-red-500/50"
                        />
                    </div>
                </Card>

                <Card className="border-border shadow-sm flex flex-row items-center p-6 bg-background group relative overflow-hidden">
                    <Banknote className="absolute -left-2 -bottom-2 w-20 h-20 text-primary/10 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
                    <div className="flex-1" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="text-right">
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Daily Charge</h3>
                            {isPriceEditing ? (
                                <input
                                    type="number"
                                    value={dailyCharge}
                                    onChange={(e) => setDailyCharge(parseInt(e.target.value))}
                                    className="text-xl font-bold text-primary bg-transparent border-none focus:ring-0 w-24 text-right p-0"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handlePriceSave()}
                                />
                            ) : (
                                <div className="flex items-baseline justify-end gap-1">
                                    <span className="text-xl font-bold text-foreground">{dailyCharge}</span>
                                    <span className="text-xs font-bold text-muted-foreground font-mono">৳</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => isPriceEditing ? handlePriceSave() : setIsPriceEditing(true)}
                            className={cn(
                                "p-2 rounded-md transition-all border",
                                isPriceEditing
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : "bg-secondary text-muted-foreground hover:text-primary border-transparent"
                            )}
                        >
                            {isPriceEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        </button>
                    </div>
                </Card>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="bg-slate-950 p-6 rounded-lg text-white relative border-none shadow-sm">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Pending Requests</p>
                        <p className="text-4xl font-bold">02</p>
                    </div>
                    <Bell className="absolute -right-2 -bottom-2 w-20 h-20 text-slate-800 rotate-12 opacity-50" />
                </Card>

                <Card className="bg-background p-6 rounded-lg border-border shadow-sm">
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">Total Earnings</p>
                    <p className="text-4xl font-bold text-foreground">14,200 <span className="text-sm font-mono font-medium text-muted-foreground">৳</span></p>
                </Card>

                <Card className="bg-background p-6 rounded-lg border-border shadow-sm">
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">Host Rating</p>
                    <div className="flex items-center gap-2">
                        <p className="text-4xl font-bold text-foreground">4.9</p>
                        <Star className="text-yellow-500 w-6 h-6 fill-current" />
                    </div>
                </Card>
            </div>

            {/* Booking Management Center */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-foreground tracking-tight">Booking Management</h2>
                    <div className="bg-secondary/30 p-1 rounded-md flex gap-1 w-full sm:w-auto border border-border">
                        <button
                            onClick={() => setBookingTab("requests")}
                            className={cn(
                                "flex-1 sm:flex-none px-4 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all",
                                bookingTab === "requests" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Requests
                        </button>
                        <button
                            onClick={() => setBookingTab("accepted")}
                            className={cn(
                                "flex-1 sm:flex-none px-4 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all",
                                bookingTab === "accepted" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Accepted
                        </button>
                    </div>
                </div>

                <Card className="bg-background rounded-lg border-border p-4 md:p-6 shadow-sm divide-y divide-border/50 min-h-[300px]">
                    {bookingTab === "requests" ? (
                        mockRequests.map((r) => (
                            <div key={r.id} className="flex flex-col md:flex-row items-center justify-between py-6 first:pt-0 last:pb-0 gap-4 group transition-all duration-300">
                                <div className="flex items-center gap-4 w-full">
                                    <Avatar className="w-12 h-12 rounded-md border shadow-sm shrink-0">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${r.seed}`} />
                                        <AvatarFallback>{r.pet[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="text-base font-bold text-foreground truncate">
                                            {r.name} <span className="text-muted-foreground font-normal mx-1">/</span> {r.pet}
                                        </p>
                                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                                            {r.type} • <span className="text-primary font-bold">{r.duration}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-md px-4 h-8 text-[11px] font-bold uppercase tracking-tight">
                                        Decline
                                    </Button>
                                    <Button size="sm" onClick={() => toast.success("Booking Secured")} className="flex-1 sm:flex-none rounded-md px-6 h-8 text-[11px] font-bold uppercase tracking-tight">
                                        Accept
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        mockAccepted.map((a) => (
                            <div key={a.id} className="flex flex-col md:flex-row items-center justify-between py-6 first:pt-0 last:pb-0 gap-4 group transition-all duration-300">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-12 h-12 rounded-md bg-secondary/50 flex items-center justify-center border shadow-sm shrink-0">
                                        <CalendarCheck className="text-muted-foreground w-6 h-6" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-base font-bold text-foreground">
                                            {a.name} <span className="text-muted-foreground font-normal mx-1">/</span> {a.pet}
                                        </p>
                                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                                            {a.type} • <span className="text-primary font-bold">{a.date}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                    <Badge variant="outline" className={cn(
                                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border-none shadow-none",
                                        a.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'
                                    )}>
                                        {a.status}
                                    </Badge>
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-md">
                                        <MessageCircle className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </Card>
            </div>
        </div>
    );
}
