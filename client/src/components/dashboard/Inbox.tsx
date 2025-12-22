import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_MESSAGES } from "./dashboard-data";
import { cn } from "@/lib/utils";

export function Inbox() {
    return (
        <div className="flex h-full bg-background animate-in fade-in duration-300">
            {/* Sidebar List */}
            <div className="w-80 border-r border-border h-full hidden lg:flex flex-col">
                <div className="p-4 border-b border-border">
                    <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">Messages</h2>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {MOCK_MESSAGES.map((msg) => (
                            <button
                                key={msg.id}
                                className={cn(
                                    "w-full p-3 rounded-md flex gap-3 transition-colors text-left",
                                    msg.active
                                        ? "bg-secondary"
                                        : "hover:bg-secondary/50"
                                )}
                            >
                                <Avatar className="w-9 h-9 border rounded-md">
                                    <AvatarImage src={msg.avatar} />
                                    <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <p className="text-sm font-semibold truncate">{msg.sender}</p>
                                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate leading-tight">
                                        {msg.lastMessage}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col h-full bg-secondary/5">
                <div className="p-4 border-b border-border flex items-center gap-3 bg-background">
                    <Avatar className="w-8 h-8 border rounded-md">
                        <AvatarImage src={MOCK_MESSAGES[0].avatar} />
                        <AvatarFallback>JN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold leading-none">{MOCK_MESSAGES[0].sender}</p>
                        <p className="text-[11px] text-emerald-500 font-medium mt-1 uppercase tracking-wider">Online</p>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-6">
                    <div className="max-w-3xl mx-auto space-y-4">
                        <div className="flex justify-end">
                            <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none shadow-sm max-w-sm text-sm font-medium leading-relaxed">
                                Hi Jonayed! Is Bruno allowed to sleep on the sofa? He's very well behaved.
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <div className="bg-background border border-border p-3 rounded-lg rounded-tl-none shadow-sm max-w-sm text-sm font-medium leading-relaxed">
                                Of course! We believe every pet is family. We love sofa cuddles here. 😊
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* Input area */}
                <div className="p-4 border-t border-border bg-background">
                    <div className="max-w-3xl mx-auto flex gap-2">
                        <Input
                            placeholder="Type your message..."
                            className="flex-1 h-10 text-sm focus-visible:ring-primary"
                        />
                        <Button size="icon" className="h-10 w-10 shrink-0">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
