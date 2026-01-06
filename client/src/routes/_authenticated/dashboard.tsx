import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import * as z from "zod";
import { useOwner, useCreateOwner } from "@/hooks/useOwner";
import { Spinner } from "@/components/ui/spinner";
import { InitialPopUpForm } from "@/components/InitialPopUpForm";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { FindSitters } from "@/components/dashboard/FindSitters";
import { MyRequests } from "@/components/dashboard/MyRequests";
import { Inbox } from "@/components/dashboard/Inbox";
import { Settings } from "@/components/dashboard/Settings";

const dashboardSearchSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  radius: z.number().optional(),
  area: z.string().optional(),
  filters: z.array(z.string()).optional().default(["All"]),
  channelId: z.string().optional(),
});

type DashboardSearch = z.infer<typeof dashboardSearchSchema>;

export const Route = createFileRoute("/_authenticated/dashboard")({
  validateSearch: (search) => dashboardSearchSchema.parse(search),
  component: Dashboard,
});

function Dashboard() {
  const { auth } = Route.useRouteContext();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: owner, isPending: isOwnerLoading } = useOwner();
  const createOwner = useCreateOwner();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sync activeTab with channelId search param
  useEffect(() => {
    if (search.channelId) {
      setActiveTab("messages");
    }
  }, [search.channelId]);


  // Derived search state from URL
  const searchParams = search.area 
    ? { area: search.area } 
    : search.lat && search.lng 
      ? { lat: search.lat, lng: search.lng, radius: search.radius || 5000 } 
      : null;
  const selectedRadius = (search.radius || 5000) / 1000;
  const selectedFilters = search.filters || ["All"];

  // Helper to update search params in URL
  const updateSearch = (updates: Partial<DashboardSearch>) => {
    navigate({
      search: (prev) => ({ ...prev, ...updates }),
      replace: true,
    });
  };

  const handleConfirm = (data: { displayName: string; displayImage: string }) => {
    createOwner.mutate(data);
  };

  if (isOwnerLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  const showPopup = !owner;
  const isSitter = !!owner?.isSitter;

  const userName = owner?.displayName || auth.user?.name || "User";
  const userImage = owner?.displayImage || auth.user?.image || "";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const renderSection = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <FindSitters
            searchParams={searchParams}
            setSearchParams={(params) => updateSearch({ 
                lat: params?.lat, 
                lng: params?.lng, 
                radius: params?.radius,
                area: params?.area 
            })}
            selectedRadius={selectedRadius}
            setSelectedRadius={(radius) => updateSearch({ radius: radius ? radius * 1000 : undefined })}
            selectedFilters={selectedFilters}
            setSelectedFilters={(filters) => {
              const newFilters = typeof filters === 'function' ? filters(selectedFilters) : filters;
              updateSearch({ filters: newFilters });
            }}

          />
        );
      case "requests":
        return <MyRequests setActiveTab={setActiveTab} />;
      case "messages":
        return <Inbox />;
      case "profile":
        return <Settings owner={owner} user={auth.user} />;
      default:
        return (
          <FindSitters
            searchParams={searchParams}
            setSearchParams={(params) => updateSearch({ 
                lat: params?.lat, 
                lng: params?.lng, 
                radius: params?.radius,
                area: params?.area 
            })}
            selectedRadius={selectedRadius}
            setSelectedRadius={(radius) => updateSearch({ radius: radius ? radius * 1000 : undefined })}
            selectedFilters={selectedFilters}
            setSelectedFilters={(filters) => {
              const newFilters = typeof filters === 'function' ? filters(selectedFilters) : filters;
              updateSearch({ filters: newFilters });
            }}

          />
        );
    }
  };

  return (
    <main className="flex h-screen bg-background text-foreground overflow-hidden">
      {showPopup && <InitialPopUpForm onConfirm={handleConfirm} />}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSitter={isSitter} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          activeTab={activeTab}
          userName={userName}
          userImage={userImage}
          userInitials={userInitials}
        />

        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          {renderSection()}
        </div>
      </div>
    </main>
  );
}