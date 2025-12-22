import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useOwner, useCreateOwner } from "@/hooks/useOwner";
import { Spinner } from "@/components/ui/spinner";
import { InitialPopUpForm } from "@/components/InitialPopUpForm";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { FindSitters } from "@/components/dashboard/FindSitters";
import { MyRequests } from "@/components/dashboard/MyRequests";
import { Inbox } from "@/components/dashboard/Inbox";
import { Settings } from "@/components/dashboard/Settings";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { auth } = Route.useRouteContext();
  const { data: owner, isPending: isOwnerLoading } = useOwner();
  const createOwner = useCreateOwner();
  const [activeTab, setActiveTab] = useState("dashboard");

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
        return <FindSitters />;
      case "requests":
        return <MyRequests setActiveTab={setActiveTab} />;
      case "messages":
        return <Inbox />;
      case "profile":
        return <Settings owner={owner} user={auth.user} createOwner={createOwner} />;
      default:
        return <FindSitters />;
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