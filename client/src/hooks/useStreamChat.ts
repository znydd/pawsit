import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuth } from '@/lib/auth';
import { chatApi } from '@/api/endpoints/chat';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

export function useStreamChat() {
    const { user, isAuthenticated } = useAuth();
    const [chatClient, setChatClient] = useState<StreamChat | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !user || !apiKey) return;

        const client = StreamChat.getInstance(apiKey);

        let isMounted = true;

        const connectUser = async () => {
            try {
                const token = await chatApi.getToken();
                
                await client.connectUser(
                    {
                        id: user.id,
                        name: (user as any).name || user.email || 'User',
                        image: (user as any).image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
                    },
                    token
                );

                if (isMounted) {
                    setChatClient(client);
                    console.log('Stream Chat connected');
                }
            } catch (error) {
                console.error('Failed to connect Stream Chat:', error);
            }
        };

        connectUser();

        return () => {
            isMounted = false;
            client.disconnectUser();
            setChatClient(null);
            console.log('Stream Chat disconnected');
        };
    }, [user, isAuthenticated]);

    return chatClient;
}
