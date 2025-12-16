import { useState } from "react";
import { useAuth } from "@/lib/auth";

interface InitialPopUpFormProps {
    onConfirm: (data: { name: string; image: string }) => void;
}

export const InitialPopUpForm = ({ onConfirm }: InitialPopUpFormProps) => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onConfirm({ name: name.trim(), image: user?.image || "" });
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
                    {/* Header */}
                    <h2 className="text-xl font-semibold text-foreground text-center mb-6">
                        Welcome! Let's set up your profile
                    </h2>

                    {/* User Image */}
                    <div className="flex justify-center mb-6">
                        <img
                            src={user.image || ""}
                            alt={user.name || "User"}
                            className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                        />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-muted-foreground mb-2"
                            >
                                Display Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Confirm
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};