import { Star, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export function SitterReviews() {
    const reviews = [
        {
            id: 1,
            sender: "Abid R. Fahim",
            pet: "Luna (Persian Cat)",
            content: "Jonayed was incredible with Luna. He sent constant updates and she looked so comfortable. Pure peace of mind.",
            rating: 5,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fahim"
        },
        {
            id: 2,
            sender: "Mustakim M.",
            pet: "Rex (Labrador)",
            content: "Highly recommend! Very professional and clearly loves pets. Rex came back exhausted and happy.",
            rating: 5,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mustakim"
        }
    ];

    return (
        <div className="p-8 lg:p-12 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 px-4 gap-4">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Host Legacy</h2>
                <span className="text-muted-foreground font-semibold text-xs uppercase tracking-wider px-3 py-1 bg-secondary rounded-full border border-border">
                    24 Stays Complete
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map((review) => (
                    <Card key={review.id} className="p-6 rounded-xl border-border shadow-sm relative group overflow-hidden bg-background hover:shadow-md transition-shadow">
                        <div className="flex gap-4 mb-6">
                            <Avatar className="w-12 h-12 rounded-md border shadow-sm shrink-0">
                                <AvatarImage src={review.avatar} />
                                <AvatarFallback>{review.sender[0]}</AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                                <p className="font-semibold text-base text-foreground truncate">{review.sender}</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider truncate">{review.pet}</p>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                            "{review.content}"
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex text-yellow-500 gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={cn("w-4 h-4 fill-current", i < review.rating ? "text-yellow-500" : "text-muted")} />
                                ))}
                            </div>
                            <MessageCircle className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
