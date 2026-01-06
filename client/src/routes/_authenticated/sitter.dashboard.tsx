import { createFileRoute, redirect } from "@tanstack/react-router"
import { useSitter } from "@/hooks/useSitter"
import { Spinner } from "@/components/ui/spinner"
import { useState, useEffect } from "react"
import * as z from "zod";
import { SitterRegistrationForm } from "@/components/sitter-dashboard/SitterRegistrationForm"
import { SitterSidebar } from "@/components/sitter-dashboard/SitterSidebar"
import { SitterHeader } from "@/components/sitter-dashboard/SitterHeader"
import { SitterOverview } from "@/components/sitter-dashboard/SitterOverview"
import { SitterInbox } from "@/components/sitter-dashboard/SitterInbox"
import { SitterReviews } from "@/components/sitter-dashboard/SitterReviews"
import { SitterGallery } from "@/components/sitter-dashboard/SitterGallery"
import { SitterSettings } from "@/components/sitter-dashboard/SitterSettings"
import { useAuth } from "@/lib/auth"
import { ownerApi } from "@/api/endpoints/owner"

const sitterDashboardSearchSchema = z.object({
  channelId: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/sitter/dashboard")({
  validateSearch: (search) => sitterDashboardSearchSchema.parse(search),
  beforeLoad: async () => {
    // Check if owner profile exists before loading sitter dashboard
    const owner = await ownerApi.getOwner();
    if (!owner) {
      throw redirect({ to: "/dashboard", search: { filters: ["All"] } });
    }
  },
  component: SitterDashboardRoot,
})

function SitterDashboardRoot() {
  const { data: sitter, isPending: isSitterLoading } = useSitter()
  const { user } = useAuth()
  const search = Route.useSearch()
  const [activeTab, setActiveTab] = useState("dashboard")

  // Sync activeTab with channelId search param
  useEffect(() => {
    if (search.channelId) {
      setActiveTab("messages")
    }
  }, [search.channelId])

  if (isSitterLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  // If no sitter profile exists, show the registration form
  if (!sitter) {
    return <SitterRegistrationForm />
  }

  // Orchestrate Dashboard Sections
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <SitterOverview setActiveTab={setActiveTab} />
      case "messages":
        return <SitterInbox />
      case "reviews":
        return <SitterReviews />
      case "gallery":
        return <SitterGallery />
      case "profile":
        return <SitterSettings sitter={sitter} user={user} />
      default:
        return <SitterOverview setActiveTab={setActiveTab} />
    }
  }

  const userName = sitter?.displayName || user?.name || "Host"
  const userImage = sitter?.displayImage || user?.image || ""
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <main className="flex h-screen bg-background text-foreground overflow-hidden">
      <SitterSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <SitterHeader
          activeTab={activeTab}
          userName={userName}
          userImage={userImage}
          userInitials={userInitials}
        />

        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          {renderContent()}
        </div>
      </div>
    </main>
  )
}
