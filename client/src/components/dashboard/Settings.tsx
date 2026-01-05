import { Camera, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUpdateOwner, useDeleteAccount } from "@/hooks/useOwner";
import { useUpload } from "@/hooks/useUpload";
import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { DHAKA_AREAS } from "shared/src/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const profileSchema = z.object({
    displayName: z.string().min(2, "Full name must be at least 2 characters"),
    phoneNumber: z.string().min(10, "Invalid contact number").optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    area: z.string().optional().or(z.literal("")),
});

interface SettingsProps {
    owner: any;
    user: any;
}

export function Settings({ owner, user }: SettingsProps) {
    const updateOwner = useUpdateOwner();
    const deleteAccount = useDeleteAccount();
    const upload = useUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigate = useNavigate();

    const userName = owner?.displayName || user?.name || "User";
    const userImage = previewImage || owner?.displayImage || user?.image || "";
    const userInitials = userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const form = useForm({
        defaultValues: {
            displayName: owner?.displayName || user?.name || "",
            phoneNumber: owner?.phoneNumber || "",
            address: owner?.address || "",
            area: owner?.area || "",
        } as z.infer<typeof profileSchema>,
        validators: {
            onSubmit: profileSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await updateOwner.mutateAsync({
                    displayName: value.displayName,
                    phoneNumber: value.phoneNumber || undefined,
                    address: value.address || undefined,
                    area: value.area || undefined,
                    displayImage: previewImage || owner?.displayImage || user?.image || undefined,
                });
                toast.success("Profile Updated");
            } catch (error) {
                toast.error("Failed to update profile");
            }
        },
    });

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await upload.mutateAsync(file);
            if (result.success && result.url) {
                setPreviewImage(result.url);
                // Immediately save the new image to the database
                await updateOwner.mutateAsync({
                    displayImage: result.url,
                });
                toast.success("Profile image updated");
            }
        } catch (error) {
            toast.error("Failed to upload image");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount.mutateAsync();
            toast.success("Account deleted successfully");
            // Sign out and redirect to home
            await authClient.signOut();
            navigate({ to: "/" });
        } catch (error) {
            toast.error("Failed to delete account");
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
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
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                type="button"
                                onClick={handleImageClick}
                                disabled={upload.isPending}
                                className="absolute -bottom-1 -right-1 rounded-md shadow-sm w-7 h-7 bg-background"
                            >
                                {upload.isPending ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Camera className="w-3.5 h-3.5" />
                                )}
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
                                    name="displayName"
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
                                    name="phoneNumber"
                                    children={(field) => (
                                        <Field>
                                            <FieldLabel className="text-xs font-semibold tracking-tight uppercase text-muted-foreground mb-1.5">
                                                Contact Number
                                            </FieldLabel>
                                            <Input
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="+880 1XXX-XXXXXX"
                                                className="h-10 text-sm"
                                            />
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <form.Field
                                        name="area"
                                        children={(field) => (
                                            <Field>
                                                <FieldLabel className="text-xs font-semibold tracking-tight uppercase text-muted-foreground mb-1.5">
                                                    Area
                                                </FieldLabel>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(value) => field.handleChange(value)}
                                                >
                                                    <SelectTrigger className="h-10 text-sm">
                                                        <SelectValue placeholder="Select Area" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {DHAKA_AREAS.map((area) => (
                                                            <SelectItem key={area} value={area}>
                                                                {area}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FieldError errors={field.state.meta.errors} />
                                            </Field>
                                        )}
                                    />
                                    <form.Field
                                        name="address"
                                        children={(field) => (
                                            <Field>
                                                <FieldLabel className="text-xs font-semibold tracking-tight uppercase text-muted-foreground mb-1.5">
                                                    Address
                                                </FieldLabel>
                                                <Input
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="Full address"
                                                    className="h-10 text-sm"
                                                />
                                                <FieldError errors={field.state.meta.errors} />
                                            </Field>
                                        )}
                                    />
                                </div>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button
                        type="submit"
                        form="profile-form"
                        disabled={updateOwner.isPending}
                        className="w-full h-10 font-semibold"
                    >
                        {updateOwner.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50 shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions that affect your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium">Delete Account</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Permanently delete your account and all associated data.
                            </p>
                        </div>
                        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove all your data including your profile, bookings, reviews, and messages.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button
                                        variant="outline"
                                        onClick={() => setDeleteDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                        disabled={deleteAccount.isPending}
                                    >
                                        {deleteAccount.isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            "Yes, delete my account"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
