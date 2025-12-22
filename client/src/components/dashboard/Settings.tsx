import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const profileSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    contactNumber: z.string().min(10, "Invalid contact number"),
    bio: z.string(),
});

interface SettingsProps {
    owner: any;
    user: any;
    createOwner: any;
}

export function Settings({ owner, user, createOwner }: SettingsProps) {
    const userName = owner?.displayName || user?.name || "User";
    const userImage = owner?.displayImage || user?.image || "";
    const userInitials = userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const form = useForm({
        defaultValues: {
            fullName: owner?.displayName || user?.name || "",
            contactNumber: owner?.contactNumber || "+880 1711-XXXXXX",
            bio: owner?.bio || "Bruno is a friendly Golden Retriever who loves balls and swimming.",
        } as z.infer<typeof profileSchema>,
        validators: {
            onSubmit: profileSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await createOwner.mutateAsync({
                    displayName: value.fullName,
                    displayImage: owner?.displayImage || user?.image || "",
                });
                toast.success("Profile Updated");
            } catch (error) {
                toast.error("Failed to update profile");
            }
        },
    });

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-border shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl">Your Profile</CardTitle>
                    <CardDescription>Manage your public profile and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="w-20 h-20 border rounded-lg">
                                <AvatarImage src={userImage} className="object-cover" />
                                <AvatarFallback className="text-xl font-bold">{userInitials}</AvatarFallback>
                            </Avatar>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute -bottom-1 -right-1 rounded-md shadow-sm w-7 h-7 bg-background"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold">{userName}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Pet Owner since 2024
                            </p>
                        </div>
                    </div>

                    <form
                        id="profile-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="space-y-5"
                    >
                        <FieldGroup>
                            <div className="grid grid-cols-1 gap-5">
                                <form.Field
                                    name="fullName"
                                    children={(field) => (
                                        <Field>
                                            <FieldLabel className="text-xs font-semibold tracking-tight uppercase text-muted-foreground mb-1.5">
                                                Full Name
                                            </FieldLabel>
                                            <Input
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                className="h-10 text-sm"
                                            />
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}
                                />
                                <form.Field
                                    name="contactNumber"
                                    children={(field) => (
                                        <Field>
                                            <FieldLabel className="text-xs font-semibold tracking-tight uppercase text-muted-foreground mb-1.5">
                                                Contact Number
                                            </FieldLabel>
                                            <Input
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                className="h-10 text-sm"
                                            />
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}
                                />
                                <form.Field
                                    name="bio"
                                    children={(field) => (
                                        <Field>
                                            <FieldLabel className="text-xs font-semibold tracking-tight uppercase text-muted-foreground mb-1.5">
                                                My Pets (Bio)
                                            </FieldLabel>
                                            <Textarea
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                rows={4}
                                                className="text-sm font-medium leading-relaxed resize-none"
                                            />
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}
                                />
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button
                        type="submit"
                        form="profile-form"
                        disabled={createOwner.isPending}
                        className="w-full h-10 font-semibold"
                    >
                        {createOwner.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
