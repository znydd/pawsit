import { useChannelStateContext } from 'stream-chat-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function AppChannelHeader() {
    const { channel } = useChannelStateContext();
    if (!channel) return null;

    const data = channel.data as any;
    const name = data?.name;
    const image = data?.image;

    return (
        <div className="p-4 border-b border-border flex items-center gap-3 bg-background/50 backdrop-blur-sm shrink-0">
            <Avatar className="w-10 h-10 border border-border shadow-sm rounded-lg">
                <AvatarImage src={image as string} />
                <AvatarFallback className="bg-primary text-primary-foreground rounded-lg">
                    {((name as string) || 'C')[0]}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold truncate text-foreground tracking-tight">
                    {name as string}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Active Now</p>
                </div>
            </div>
        </div>
    );
}
