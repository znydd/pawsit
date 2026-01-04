import { UploadCloud, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSitterPhotos, useUploadSitterPhoto } from "@/hooks/useSitter";
import { uploadApi } from "@/api/endpoints/upload";
import { useRef, useState } from "react";
import type { SitterPhoto } from "shared/src";

export function SitterGallery() {
    const { data: photos, isLoading } = useSitterPhotos();
    const uploadPhotoMutation = useUploadSitterPhoto();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Upload to Cloudinary
            const uploadRes = await uploadApi.uploadImage(file);
            if (uploadRes.success && uploadRes.url) {
                // 2. Save to our database
                await uploadPhotoMutation.mutateAsync({
                    imageUrl: uploadRes.url,
                    photoType: "environment", // or "sitting_environment"
                    caption: "Sitting environment"
                });
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Failed to upload image to storage");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("An error occurred during upload");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="p-8 lg:p-12 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 px-4 gap-6">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">The Environment</h2>
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="font-bold text-[10px] uppercase tracking-wider shadow-sm transition-all flex items-center gap-3 active:scale-95"
                    size="lg"
                >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    {isUploading ? "Uploading..." : "Add Perspective"}
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="aspect-4/5 rounded-xl bg-muted animate-pulse" />
                    ))
                ) : (
                    photos?.map((img: SitterPhoto) => (
                        <div key={img.id} className="aspect-4/5 rounded-xl overflow-hidden shadow-sm relative group border border-border bg-muted">
                            <img
                                src={img.imageUrl}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={img.caption || "Environment"}
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                                <p className="text-white font-bold text-[10px] uppercase tracking-wider">{img.caption || "Environment"}</p>
                            </div>
                        </div>
                    ))
                )}

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="aspect-4/5 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground/40 gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all group disabled:opacity-50"
                >
                    {isUploading ? (
                        <Loader2 className="w-10 h-10 animate-spin" />
                    ) : (
                        <ImagePlus className="w-10 h-10 group-hover:scale-105 transition-transform" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        {isUploading ? "Processing..." : "New Perspective"}
                    </span>
                </button>
            </div>
        </div>
    );
}
