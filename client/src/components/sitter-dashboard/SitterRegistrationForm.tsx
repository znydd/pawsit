import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"
import { MapPin, Loader2, Image as ImageIcon } from "lucide-react"
import { useState, useRef } from "react"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateSitter } from "@/hooks/useSitter"
import { useUpload } from "@/hooks/useUpload"

const sitterFormSchema = z.object({
    phoneNumber: z.string().min(11, "Phone number must be at least 11 characters"),
    headline: z.string().min(5, "Headline must be at least 5 characters"),
    bio: z.string(),
    address: z.string().min(5, "Address must be at least 5 characters"),
    area: z.string().min(2, "Area must be at least 2 characters"),
    location: z.object({
        lat: z.number(),
        lng: z.number(),
    }),
    experienceYears: z.number().min(0),
    acceptsLargeDogs: z.boolean(),
    acceptsSmallDogs: z.boolean(),
    acceptsCats: z.boolean(),
    acceptsFish: z.boolean(),
    acceptsBirds: z.boolean(),
    acceptsOtherPets: z.boolean(),
    nidImage: z.string().min(1, "NID Image is required"),
})

type SitterFormValues = z.infer<typeof sitterFormSchema>

export function SitterRegistrationForm() {
    const createSitter = useCreateSitter()
    const upload = useUpload()
    const [isLocating, setIsLocating] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm({
        defaultValues: {
            phoneNumber: "",
            headline: "",
            bio: "",
            address: "",
            area: "",
            location: {
                lat: 0,
                lng: 0,
            },
            experienceYears: 0,
            acceptsLargeDogs: false,
            acceptsSmallDogs: false,
            acceptsCats: false,
            acceptsFish: false,
            acceptsBirds: false,
            acceptsOtherPets: false,
            nidImage: "",
        } as SitterFormValues,
        validators: {
            onSubmit: sitterFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await createSitter.mutateAsync(value)
                toast.success("Profile created successfully!")
            } catch (error) {
                console.error("Submission failed:", error)
                toast.error("Failed to create profile")
            }
        },
    })

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        toast.promise(upload.mutateAsync(file), {
            loading: "Uploading NID Image...",
            success: (data) => {
                form.setFieldValue("nidImage", data.url)
                return "Image uploaded successfully!"
            },
            error: "Failed to upload image",
        })
    }

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser")
            return
        }

        setIsLocating(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                form.setFieldValue("location.lat", position.coords.latitude)
                form.setFieldValue("location.lng", position.coords.longitude)
                setIsLocating(false)
                toast.success("Location updated!")
            },
            () => {
                setIsLocating(false)
                toast.error("Unable to retrieve your location")
            }
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto shadow-sm">
            <Card className="border-border shadow-md rounded-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold tracking-tight">Become a Pet Sitter</CardTitle>
                    <CardDescription>Fill out the form below to register as a pet sitter on PawSit.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="sitter-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
                        className="space-y-6"
                    >
                        <FieldGroup>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Headline */}
                                <form.Field
                                    name="headline"
                                    children={(field) => (
                                        <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                                            <FieldLabel htmlFor={field.name}>Headline</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Experienced dog walker in downtown"
                                                className="rounded-md"
                                            />
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}
                                />

                                {/* Phone Number */}
                                <form.Field
                                    name="phoneNumber"
                                    children={(field) => (
                                        <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                                            <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="+880 1XXX XXXXXX"
                                                className="rounded-md"
                                            />
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}
                                />

                                {/* Bio */}
                                <div className="md:col-span-2">
                                    <form.Field
                                        name="bio"
                                        children={(field) => (
                                            <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                                                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                                                <Textarea
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="Tell us about yourself and your experience with pets..."
                                                    className="rounded-md min-h-[120px]"
                                                />
                                                <FieldError errors={field.state.meta.errors} />
                                            </Field>
                                        )}
                                    />
                                </div>

                                {/* Address */}
                                <form.Field
                                    name="address"
                                    children={(field) => (
                                        <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                                            <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Road 12, Banani"
                                                className="rounded-md"
                                            />
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}
                                />

                                {/* Area */}
                                <form.Field
                                    name="area"
                                    children={(field) => (
                                        <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                                            <FieldLabel htmlFor={field.name}>Area</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Dhaka"
                                                className="rounded-md"
                                            />
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}
                                />

                                {/* Location */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className="flex items-end gap-4">
                                        <form.Field
                                            name="location.lat"
                                            children={(field) => (
                                                <Field className="flex-1" data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                                                    <FieldLabel htmlFor={field.name}>Latitude</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="number"
                                                        step="any"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                                                        className="rounded-md"
                                                    />
                                                </Field>
                                            )}
                                        />
                                        <form.Field
                                            name="location.lng"
                                            children={(field) => (
                                                <Field className="flex-1" data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                                                    <FieldLabel htmlFor={field.name}>Longitude</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="number"
                                                        step="any"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                                                        className="rounded-md"
                                                    />
                                                </Field>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleGetLocation}
                                            disabled={isLocating}
                                            className="h-10 px-4 rounded-md"
                                        >
                                            {isLocating ? <Loader2 className="animate-spin w-4 h-4" /> : <MapPin className="w-4 h-4 mr-2" />}
                                            <span className="hidden sm:inline">Get Location</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Experience Years */}
                                <form.Field
                                    name="experienceYears"
                                    children={(field) => (
                                        <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                                            <FieldLabel htmlFor={field.name}>Years of Experience</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="number"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                                className="rounded-md"
                                            />
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}
                                />
                                {/* NID Image */}
                                <form.Field
                                    name="nidImage"
                                    children={(field) => (
                                        <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                                            <FieldLabel htmlFor={field.name}>NID Image</FieldLabel>
                                            <div className="flex items-center gap-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={upload.isPending}
                                                    className="rounded-md"
                                                >
                                                    {upload.isPending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <ImageIcon className="mr-2 w-4 h-4" />}
                                                    {field.state.value ? "Change" : "Upload NID"}
                                                </Button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                {field.state.value && (
                                                    <div className="relative group overflow-hidden rounded-md border">
                                                        <img
                                                            src={field.state.value}
                                                            alt="NID Preview"
                                                            className="h-10 w-16 object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}
                                />
                            </div>

                            {/* Pet Preferences */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">I accept:</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                                    {[
                                        { name: "acceptsSmallDogs" as const, label: "Small Dogs" },
                                        { name: "acceptsLargeDogs" as const, label: "Large Dogs" },
                                        { name: "acceptsCats" as const, label: "Cats" },
                                        { name: "acceptsFish" as const, label: "Fish" },
                                        { name: "acceptsBirds" as const, label: "Birds" },
                                        { name: "acceptsOtherPets" as const, label: "Other Pets" },
                                    ].map((pref) => (
                                        <form.Field
                                            key={pref.name}
                                            name={pref.name}
                                            children={(field) => (
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <Checkbox
                                                        id={pref.name}
                                                        checked={field.state.value}
                                                        onCheckedChange={(checked) => field.handleChange(!!checked)}
                                                    />
                                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{pref.label}</span>
                                                </label>
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="pt-6 border-t font-semibold">
                    <Button
                        type="submit"
                        form="sitter-form"
                        className="w-full h-10 font-bold uppercase tracking-tight rounded-md transition-all active:scale-95"
                        disabled={createSitter.isPending}
                    >
                        {createSitter.isPending && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
                        Register as Host
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
