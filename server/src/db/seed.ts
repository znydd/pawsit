import { db } from "./index";
import { user } from "../../../shared/src/db/auth.schema";
import { petOwnerTable, petSitterTable, serviceTable, sitterAvailabilityTable } from "../../../shared/src/db/schema";

async function main() {
    console.log("Seeding database...");

    const mockUsers = [
        {
            id: "user_1",
            name: "John Doe",
            email: "john@example.com",
            location: { x: 90.4125, y: 23.8103 }, // Gulshan
            city: "Dhaka",
            address: "Gulshan 2",
        },
        {
            id: "user_2",
            name: "Jane Smith",
            email: "jane@example.com",
            location: { x: 90.3934, y: 23.7511 }, // Karwan Bazar
            city: "Dhaka",
            address: "Karwan Bazar",
        },
        {
            id: "user_3",
            name: "Alice Johnson",
            email: "alice@example.com",
            location: { x: 90.4043, y: 23.7940 }, // Banani
            city: "Dhaka",
            address: "Banani",
        },
        {
            id: "user_4",
            name: "Bob Brown",
            email: "bob@example.com",
            location: { x: 90.3795, y: 23.8759 }, // Uttara
            city: "Dhaka",
            address: "Uttara Sector 4",
        },
        {
            id: "user_5",
            name: "Charlie Wilson",
            email: "charlie@example.com",
            location: { x: 90.3742, y: 23.7461 }, // Dhanmondi
            city: "Dhaka",
            address: "Dhanmondi 27",
        }
    ];

    for (const mock of mockUsers) {
        // 1. Create User
        await db.insert(user).values({
            id: mock.id,
            name: mock.name,
            email: mock.email,
        }).onConflictDoNothing();

        // 2. Create Pet Owner
        await db.insert(petOwnerTable).values({
            userId: mock.id,
            displayName: mock.name,
            displayImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mock.id}`,
            phoneNumber: "01711111111",
            address: mock.address,
            area: mock.city,
            location: mock.location,
            isSitter: true,
        }).onConflictDoNothing();

        // 3. Create Pet Sitter
        const [sitter] = await db.insert(petSitterTable).values({
            userId: mock.id,
            displayName: mock.name,
            displayImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mock.id}`,
            phoneNumber: "01711111111",
            headline: `Professional sitter in ${mock.address}`,
            bio: "I love pets and have plenty of space for them to play.",
            address: mock.address,
            area: mock.city,
            location: mock.location,
            experienceYears: 3,
            nidImage: "https://example.com/nid.jpg",
            verified: true,
            updatedAt: new Date(),
        }).onConflictDoNothing().returning();

        // 4. Initialize default service (similar to controller)
        if (sitter) {
            await db.insert(serviceTable).values({
                sitterId: sitter.id,
                serviceType: "house_sitting",
                pricePerDay: 100,
                isActive: true,
                updatedAt: new Date(),
            }).onConflictDoNothing();

            // 5. Initialize sitter availability (similar to controller)
            await db.insert(sitterAvailabilityTable).values({
                sitterId: sitter.id,
                isAvailable: true,
                isBanned: false,
                updatedAt: new Date(),
            }).onConflictDoNothing();
        }
    }

    console.log("Seeding complete!");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:");
    console.error(err);
    process.exit(1);
});
