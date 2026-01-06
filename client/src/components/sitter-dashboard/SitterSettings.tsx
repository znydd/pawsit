import { Camera, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useUpdateSitter } from "@/hooks/useSitter";
import { useUpload } from "@/hooks/useUpload";
import { useRef, useState } from "react";
import { DHAKA_AREAS } from "shared/src/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const sitterProfileSchema = z.object({
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z.string().optional().or(z.literal("")),
    headline: z.string().optional().or(z.literal("")),
    bio: z.string().optional().or(z.literal("")),
    experienceYears: z.number().min(0).optional(),
    acceptsLargeDogs: z.boolean(),
    acceptsSmallDogs: z.boolean(),
    acceptsCats: z.boolean(),
    acceptsFish: z.boolean(),
    acceptsBirds: z.boolean(),
    acceptsOtherPets: z.boolean(),
    area: z.string().min(2, "Area is required"),
});

type SitterProfileValues = z.infer<typeof sitterProfileSchema>;

export function SitterSettings({ sitter, user }: { sitter: any; user: any }) {
    const updateSitter = useUpdateSitter();
    const upload = useUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const userName = sitter?.displayName || user?.name || "Host";
    const userImage = previewImage || sitter?.displayImage || user?.image || "";
    const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

    const form = useForm({
        defaultValues: {
            displayName: userName,
            phoneNumber: sitter?.phoneNumber || "",
            headline: sitter?.headline || "",
            bio: sitter?.bio || "",
            experienceYears: sitter?.experienceYears || 0,
            acceptsLargeDogs: sitter?.acceptsLargeDogs ?? false,
            acceptsSmallDogs: sitter?.acceptsSmallDogs ?? false,
            acceptsCats: sitter?.acceptsCats ?? false,
            acceptsFish: sitter?.acceptsFish ?? false,
            acceptsBirds: sitter?.acceptsBirds ?? false,
            acceptsOtherPets: sitter?.acceptsOtherPets ?? false,
            area: sitter?.area || "",
        } as SitterProfileValues,
        validators: {
            onSubmit: sitterProfileSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await updateSitter.mutateAsync({
                    displayName: value.displayName,
                    phoneNumber: value.phoneNumber || undefined,
                    headline: value.headline || undefined,
                    bio: value.bio || undefined,
                    experienceYears: value.experienceYears,
                    acceptsLargeDogs: value.acceptsLargeDogs,
                    acceptsSmallDogs: value.acceptsSmallDogs,
                    acceptsCats: value.acceptsCats,
                    acceptsFish: value.acceptsFish,
                    acceptsBirds: value.acceptsBirds,
                    acceptsOtherPets: value.acceptsOtherPets,
                    area: value.area,
                    displayImage: previewImage || sitter?.displayImage || undefined,
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
                await updateSitter.mutateAsync({
                    displayImage: result.url,
                });
                toast.success("Profile image updated");
            }
        } catch (error) {
            toast.error("Failed to upload image");
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-border shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl">Sitter Profile</CardTitle>
                    <CardDescription>Manage your sitter profile and preferences.</CardDescription>
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
                                Pet Sitter since 2024
                            </p>
                        </div>
                    </div>

                    <form
                        id="sitter-settings-form"
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
                                                Display Name
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
                                <div className="grid grid-cols-2 gap-4">
                                    <form.Field
                                        name="phoneNumber"
                                        children={(field) => (
                                            <Field>
                                                <FieldLabel className="text-xs font-semibold tracking-tight uppercase text-muted-foreground mb-1.5">
                                                    Phone Number
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
                                    <form.Field
                                        name="experienceYears"
                                        children={(field) => (
                                            <Field>
                                                <FieldLabel className="text-xs font-semibold tracking-tight uppercase text-muted-foreground mb-1.5">
                                                    Years of Experience
                                                </FieldLabel>
                                                <Input
                                                    type="number"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                                                    className="h-10 text-sm"
                                                />
                                                <FieldError errors={field.state.meta.errors} />
                                            </Field>
                                        )}
                                    />
                                </div>
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
                                                    <SelectValue placeholder="Select area" />
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
                                    name="headline"
                                    children={(field) => (
                                        <Field>
                                            <FieldLabel className="text-xs font-semibold tracking-tight uppercase text-muted-foreground mb-1.5">
                                                Headline
                                            </FieldLabel>
                                            <Input
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Pet lover with 5 years experience"
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
                                                About Me
                                            </FieldLabel>
                                            <Textarea
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                rows={4}
                                                placeholder="Tell pet owners about your care philosophy..."
                                                className="text-sm font-medium leading-relaxed resize-none"
                                            />
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}
                                />

                                {/* Pet Acceptance Toggles */}
                                <div className="space-y-3">
                                    <FieldLabel className="text-xs font-semibold tracking-tight uppercase text-muted-foreground">
                                        Pets I Accept
                                    </FieldLabel>
                                    <div className="grid grid-cols-2 gap-3">
                                        <form.Field
                                            name="acceptsLargeDogs"
                                            children={(field) => (
                                                <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                    <span className="text-sm font-medium">Large Dogs</span>
                                                    <Switch
                                                        checked={field.state.value}
                                                        onCheckedChange={(checked) => field.handleChange(checked)}
                                                    />
                                                </label>
                                            )}
                                        />
                                        <form.Field
                                            name="acceptsSmallDogs"
                                            children={(field) => (
                                                <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                    <span className="text-sm font-medium">Small Dogs</span>
                                                    <Switch
                                                        checked={field.state.value}
                                                        onCheckedChange={(checked) => field.handleChange(checked)}
                                                    />
                                                </label>
                                            )}
                                        />
                                        <form.Field
                                            name="acceptsCats"
                                            children={(field) => (
                                                <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                    <span className="text-sm font-medium">Cats</span>
                                                    <Switch
                                                        checked={field.state.value}
                                                        onCheckedChange={(checked) => field.handleChange(checked)}
                                                    />
                                                </label>
                                            )}
                                        />
                                        <form.Field
                                            name="acceptsFish"
                                            children={(field) => (
                                                <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                    <span className="text-sm font-medium">Fish</span>
                                                    <Switch
                                                        checked={field.state.value}
                                                        onCheckedChange={(checked) => field.handleChange(checked)}
                                                    />
                                                </label>
                                            )}
                                        />
                                        <form.Field
                                            name="acceptsBirds"
                                            children={(field) => (
                                                <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                    <span className="text-sm font-medium">Birds</span>
                                                    <Switch
                                                        checked={field.state.value}
                                                        onCheckedChange={(checked) => field.handleChange(checked)}
                                                    />
                                                </label>
                                            )}
                                        />
                                        <form.Field
                                            name="acceptsOtherPets"
                                            children={(field) => (
                                                <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                    <span className="text-sm font-medium">Other Pets</span>
                                                    <Switch
                                                        checked={field.state.value}
                                                        onCheckedChange={(checked) => field.handleChange(checked)}
                                                    />
                                                </label>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button
                        type="submit"
                        form="sitter-settings-form"
                        disabled={updateSitter.isPending}
                        className="w-full h-10 font-semibold"
                    >
                        {updateSitter.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
