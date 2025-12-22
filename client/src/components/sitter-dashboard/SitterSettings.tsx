import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card } from "@/components/ui/card";

const sitterProfileSchema = z.object({
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    hourlyRate: z.number().min(0, "Rate must be positive"),
    bio: z.string(),
});

type SitterProfileValues = z.infer<typeof sitterProfileSchema>;

export function SitterSettings({ sitter, user }: { sitter: any; user: any }) {
    const userName = sitter?.displayName || user?.name || "Host";
    const userImage = sitter?.displayImage || user?.image || "";
    const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

    const form = useForm({
        defaultValues: {
            displayName: userName,
            hourlyRate: 1200,
            bio: sitter?.bio || "I believe every pet deserves a vacation while their owners are away.",
        } as SitterProfileValues,
        validators: {
            onSubmit: sitterProfileSchema,
        },
        onSubmit: async () => {
            toast.success("Profile Secured");
        },
    });

    return (
        <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full animate-in fade-in duration-300">
            <Card className="bg-background border-border rounded-xl p-8 lg:p-16 shadow-sm space-y-12">
                <div className="flex flex-col items-center gap-8 border-b pb-12 border-border/50">
                    <div className="relative group">
                        <Avatar className="w-40 h-40 rounded-full border-4 border-background shadow-xl ring-1 ring-border transition-transform group-hover:scale-105">
                            <AvatarImage src={userImage} className="object-cover" />
                            <AvatarFallback className="text-4xl font-bold">{userInitials}</AvatarFallback>
                        </Avatar>
                        <button className="absolute -bottom-2 -right-2 bg-slate-950 text-white p-3 rounded-full shadow-lg hover:bg-orange-500 transition-colors">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-foreground italic tracking-tight">{userName}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 italic">
                            Verified Partner since 2023
                        </p>
                    </div>
                </div>

                <form
                    id="sitter-settings-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-10"
                >
                    <FieldGroup className="md:col-span-1 space-y-3">
                        <form.Field
                            name="displayName"
                            children={(field) => (
                                <Field>
                                    <FieldLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Display Name</FieldLabel>
                                    <Input
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="w-full rounded-md"
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <FieldGroup className="md:col-span-1 space-y-3">
                        <form.Field
                            name="hourlyRate"
                            children={(field) => (
                                <Field>
                                    <FieldLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Hourly Rate (৳)</FieldLabel>
                                    <Input
                                        type="number"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                        className="w-full rounded-md"
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <FieldGroup className="md:col-span-2 space-y-3">
                        <form.Field
                            name="bio"
                            children={(field) => (
                                <Field>
                                    <FieldLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Host Philosophy</FieldLabel>
                                    <Textarea
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        rows={5}
                                        className="w-full rounded-md italic text-muted-foreground min-h-[150px]"
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>

                <Button
                    type="submit"
                    form="sitter-settings-form"
                    className="w-full py-8 bg-slate-950 text-white rounded-xl font-bold text-xs tracking-widest uppercase shadow-xl hover:bg-orange-500 transition-all transform active:scale-95"
                >
                    Sync Settings
                </Button>
            </Card>
        </div>
    );
}
