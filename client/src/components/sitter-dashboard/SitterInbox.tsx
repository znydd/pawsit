import { useStreamChat } from "@/hooks/useStreamChat";
import { 
    Chat, 
    Channel, 
    ChannelList, 
    Window, 
    MessageList, 
    MessageInput, 
    Thread 
} from "stream-chat-react";
import { useAuth } from "@/lib/auth";
import { AppChannelHeader } from "@/components/chat/AppChannelHeader";

export function SitterInbox() {
    const chatClient = useStreamChat();
    const { user } = useAuth();

    if (!chatClient || !user) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Initializing chat...</p>
            </div>
        );
    }

    const filters = { members: { $in: [user.id] }, type: 'messaging' };
    const sort: any = { last_message_at: -1 };

    return (
        <div className="flex h-[calc(100vh-65px)] bg-background overflow-hidden">
            <Chat client={chatClient} theme="str-chat__theme-light">
                {/* Sidebar */}
                <div className="w-80 border-r border-border h-full hidden lg:flex flex-col bg-card/50">
                    <div className="p-6 border-b border-border bg-background/50 backdrop-blur-sm">
                        <h2 className="text-xl font-bold tracking-tight text-foreground">Messages</h2>
                        <p className="text-xs text-muted-foreground mt-1">Chat with your pet owners</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <ChannelList 
                            filters={filters} 
                            sort={sort} 
                            options={{ state: true, presence: true, limit: 10 }}
                        />
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col h-full bg-secondary/5 relative text-foreground">
                    <Channel>
                        <Window>
                            <AppChannelHeader />
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <MessageList />
                                <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border mt-auto">
                                    <MessageInput />
                                </div>
                            </div>
                        </Window>
                        <Thread />
                    </Channel>
                </div>
            </Chat>
        </div>
    );
}
