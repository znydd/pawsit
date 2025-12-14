import { createFileRoute } from "@tanstack/react-router";
import { signOutUser } from "../../lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { auth } = Route.useRouteContext();

  return (
    <main className="h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b border-border/40 bg-background">
        <div className="flex items-center justify-between px-8 py-6">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">PetSit</h1>
          <button className="px-4 py-2 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-all">
            <img src={auth.user?.image ?? "Not Image"} alt="avatar" />
            Profile
          </button>
        </div>
        <button onClick={signOutUser}>Sign Out</button>
      </header>

      {/* Main Content */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-4xl font-medium tracking-tight text-foreground">Welcome back</h2>
            <p className="text-muted-foreground">Here's what's happening with your pets today</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1 */}
            <div className="p-8 rounded-2xl border border-border/40 bg-background hover:border-border transition-all">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
                <p className="text-5xl font-medium tracking-tight text-foreground">3</p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="p-8 rounded-2xl border border-border/40 bg-background hover:border-border transition-all">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Total Pets</p>
                <p className="text-5xl font-medium tracking-tight text-foreground">2</p>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="p-8 rounded-2xl border border-border/40 bg-background hover:border-border transition-all">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Hours Booked</p>
                <p className="text-5xl font-medium tracking-tight text-foreground">24</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h3 className="text-2xl font-medium tracking-tight text-foreground">Recent Activity</h3>
            <div className="space-y-4">
              {/* Activity Item 1 */}
              <div className="p-6 rounded-xl border border-border/40 bg-background hover:border-border transition-all">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Booking confirmed for Max</p>
                    <p className="text-sm text-muted-foreground">Tomorrow at 9:00 AM</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-foreground/5 text-foreground font-medium">
                    Upcoming
                  </span>
                </div>
              </div>

              {/* Activity Item 2 */}
              <div className="p-6 rounded-xl border border-border/40 bg-background hover:border-border transition-all">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Bella's sitting completed</p>
                    <p className="text-sm text-muted-foreground">Yesterday at 6:00 PM</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-foreground/5 text-foreground font-medium">
                    Completed
                  </span>
                </div>
              </div>

              {/* Activity Item 3 */}
              <div className="p-6 rounded-xl border border-border/40 bg-background hover:border-border transition-all">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">New message from sitter</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-foreground/5 text-foreground font-medium">
                    Read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}