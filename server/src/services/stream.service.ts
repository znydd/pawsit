import { StreamChat } from 'stream-chat';

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.warn("STREAM_API_KEY or STREAM_API_SECRET is not set. Chat features will not work.");
}

const serverClient = StreamChat.getInstance(apiKey || '', apiSecret || '');

export const streamService = {
    createToken: (userId: string) => {
        return serverClient.createToken(userId);
    },

    createChannel: async (bookingId: number, memberIds: string[]) => {
        const channel = serverClient.channel('messaging', `booking_${bookingId}`, {
            name: `Booking #${bookingId}`,
            members: memberIds,
            created_by_id: memberIds[0],
        } as any);
        await channel.create();
        return channel;
    },

    syncUser: async (userId: string, data: { name: string; image?: string }) => {
        await serverClient.upsertUser({
            id: userId,
            name: data.name,
            image: data.image,
        });
    }
};
