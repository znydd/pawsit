export const MOCK_SITTERS = [
    {
        id: 1,
        name: "Jonayed Nabil",
        location: "Banani, Dhaka",
        price: "1,200",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1513360371669-4ada307f933b?auto=format&fit=crop&w=400",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jonayed",
        description: "Extremely spacious apartment with a dedicated balcony for pets to play safely.",
        verified: true,
    },
    {
        id: 2,
        name: "Mustakim Mahmud",
        location: "Uttara, Sector 4",
        price: "800",
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=400",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sitter2",
        description: "Huge fan of Golden Retrievers. I take pets on long walks in the nearby park.",
        verified: false,
    },
    {
        id: 3,
        name: "Mozahedul Hoque",
        location: "Mirpur 12, Dhaka",
        price: "1,000",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?auto=format&fit=crop&w=400",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Musa",
        description: "Professional pet sitter with 5 years of experience. I have a large garden.",
        verified: true,
    }
];

export const MOCK_REQUESTS = [
    {
        id: 1,
        sitterName: "Jonayed Nabil",
        pet: "Bruno",
        dates: "Dec 24-26",
        total: "3,600",
        status: "Pending",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jonayed",
    },
    {
        id: 2,
        sitterName: "Mozahedul Hoque",
        pet: "Luna",
        dates: "Dec 12-14",
        total: "2,400",
        status: "Accepted",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Musa",
    },
];

export const MOCK_MESSAGES = [
    {
        id: 1,
        sender: "Jonayed Nabil",
        lastMessage: "Of course! We believe every pet is family.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jonayed",
        active: true,
        time: "10:15 AM"
    },
];
