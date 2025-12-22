import { Search, MapPin, Star, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_SITTERS } from "./dashboard-data";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FindSitters() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(["All"]);
    const [selectedRadius, setSelectedRadius] = useState<number | null>(null);

    const petFilters = ["All", "Cats", "Dogs", "Fish", "Bird", "Other"];

    const toggleFilter = (filter: string) => {
        if (filter === "All") {
            setSelectedFilters(["All"]);
            return;
        }

        setSelectedFilters((prev) => {
            const newFilters = prev.filter((f) => f !== "All");
            if (newFilters.includes(filter)) {
                const updated = newFilters.filter((f) => f !== filter);
                return updated.length === 0 ? ["All"] : updated;
            } else {
                return [...newFilters, filter];
            }
        });
    };

    const handleLocationSearch = () => {
        if (!selectedRadius) {
            toast.error("Please select a radius first");
            return;
        }
        toast.info(`Searching for sitters within ${selectedRadius}km of your location...`);
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Search & Advanced Filters */}
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch bg-background border border-border p-6 rounded-lg shadow-sm">
                {/* Left Side: Manual Search & Pet Filters (flex-[3]) */}
                <div className="flex-3 w-full space-y-4">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Manual Search</p>
                        <div className="relative group w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search by area (e.g. Banani, Dhaka...)"
                                className="pl-9 h-10 rounded-md border-border shadow-sm focus-visible:ring-primary w-full"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {petFilters.map((filter) => {
                            const isSelected = selectedFilters.includes(filter);
                            return (
                                <button
                                    key={filter}
                                    onClick={() => toggleFilter(filter)}
                                    className={cn(
                                        "rounded-full h-8 px-4 text-xs font-bold transition-all border",
                                        isSelected
                                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                            : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary/50"
                                    )}
                                >
                                    {filter}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Vertical Divider (Hidden on small screens) */}
                <div className="hidden lg:block w-px bg-border my-2 mx-4" />

                {/* Right Side: Location Search & Radius (flex-[2]) */}
                <div className="flex-2 flex flex-col items-center lg:items-start gap-4 shrink-0 w-full border-t lg:border-t-0 pt-6 lg:pt-0">
                    <div className="w-full space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search by Location</p>
                        <Button
                            className="h-10 px-6 gap-2 font-bold shadow-sm w-full"
                            onClick={handleLocationSearch}
                        >
                            <Navigation className="w-4 h-4" />
                            Use My Location
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 bg-secondary/30 p-1.5 rounded-lg border border-border w-full justify-center lg:justify-start">
                        {[5, 10].map((radius) => (
                            <button
                                key={radius}
                                onClick={() => setSelectedRadius(radius)}
                                className={cn(
                                    "rounded-md h-8 px-4 text-[11px] font-bold transition-all border flex-1",
                                    selectedRadius === radius
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm"
                                        : "bg-transparent text-muted-foreground border-transparent hover:bg-secondary/50"
                                )}
                            >
                                {radius}km
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sitter Grid - Compact version */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {MOCK_SITTERS.map((sitter) => (
                    <Card key={sitter.id} className="overflow-hidden border-border shadow-none hover:border-primary/30 hover:shadow-md transition-all group flex flex-col">
                        <div className="h-32 relative overflow-hidden shrink-0">
                            <img
                                src={sitter.image}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={sitter.name}
                            />
                            {sitter.verified && (
                                <Badge className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-[10px] py-0 h-5 border-none shadow-sm" variant="secondary">
                                    Verified
                                </Badge>
                            )}
                        </div>
                        <CardContent className="p-3 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-6 h-6 border shadow-sm">
                                            <AvatarImage src={sitter.avatar} />
                                            <AvatarFallback>{sitter.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-sm font-bold truncate max-w-[100px]">{sitter.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary leading-none">{sitter.price}৳</p>
                                        <p className="text-[9px] text-muted-foreground uppercase font-bold mt-0.5">/ day</p>
                                    </div>
                                </div>

                                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-2 font-medium">
                                    <MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{sitter.location}</span>
                                </p>

                                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-[11px] font-bold text-foreground">{sitter.rating}</span>
                                </div>
                            </div>

                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => toast.success(`Request Sent to ${sitter.name}`)}
                                className="w-full h-8 text-[11px] font-bold uppercase tracking-tight"
                            >
                                Book Sitter
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
