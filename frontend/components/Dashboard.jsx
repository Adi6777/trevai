"use client";

import {
  CalendarRange,
  Hotel,
  Loader2,
  LogOut,
  Map,
  RefreshCw,
  Route,
  Sparkles,
  WalletCards
} from "lucide-react";
import TripForm from "@/components/TripForm";
import TripDetail from "@/components/TripDetail";

const formatDate = (value) => {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
};

export default function Dashboard({
  user,
  trips,
  selectedTrip,
  loading,
  saving,
  error,
  onCreateTrip,
  onSelectTrip,
  onGenerateTrip,
  onLogout
}) {
  const generatedTrips = trips.filter(
    (trip) => trip.status === "generated"
  ).length;
  const isGenerating = saving === "generate";
  const tripActionLabel =
    selectedTrip?.status === "generated" ? "Regenerate" : "Generate";

  return (
    <main className="min-h-screen p-2 sm:p-4 md:p-5">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="glass-panel rounded-2xl p-4 lg:sticky lg:top-5 lg:max-h-[calc(100vh-40px)] lg:overflow-y-auto">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0f766e] sm:text-sm sm:tracking-[0.18em]">
                Trevai
              </p>
              <h1 className="text-lg font-semibold sm:text-xl">
                Planner cockpit
              </h1>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#d9e2df] bg-white text-[#66737a] hover:text-[#172126]"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div className="mt-5 rounded-2xl bg-[#172126] p-4 text-white">
            <p className="text-sm text-white/70">Signed in as</p>
            <p className="mt-1 break-words font-semibold">{user?.fullName}</p>
            <p className="break-all text-sm text-white/70">{user?.email}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#d9e2df] bg-white p-3">
              <Route size={18} className="text-[#e76f51]" />
              <p className="mt-2 text-2xl font-semibold">{trips.length}</p>
              <p className="text-xs text-[#66737a]">Trips</p>
            </div>
            <div className="rounded-2xl border border-[#d9e2df] bg-white p-3">
              <Map size={18} className="text-[#4f8f58]" />
              <p className="mt-2 text-2xl font-semibold">
                {generatedTrips}
              </p>
              <p className="text-xs text-[#66737a]">Generated</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#66737a]">
              Trips
            </h2>
            {loading && <Loader2 size={16} className="animate-spin" />}
          </div>

          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1 sm:max-h-[32vh] lg:max-h-[34vh]">
            {trips.map((trip) => (
              <button
                key={trip._id}
                onClick={() => onSelectTrip(trip._id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  selectedTrip?._id === trip._id
                    ? "border-[#0f766e] bg-[#e6f3ef]"
                    : "border-[#d9e2df] bg-white hover:border-[#0f766e]/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{trip.destination}</p>
                    <p className="mt-1 text-xs text-[#66737a]">
                      {formatDate(trip.startDate)} to {formatDate(trip.endDate)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f2b84b]/20 px-2 py-1 text-xs font-medium text-[#7c5200]">
                    {trip.status}
                  </span>
                </div>
              </button>
            ))}

            {trips.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#d9e2df] bg-white p-4 text-sm text-[#66737a]">
                Create your first trip brief to start planning.
              </div>
            )}
          </div>
        </aside>

        <section className="space-y-4">
          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
            <div className="glass-panel rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76f51] sm:text-sm sm:tracking-[0.18em]">
                    AI editable itinerary
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold leading-tight sm:text-3xl">
                    Plan, generate, then tune the details.
                  </h2>
                </div>
                <div className="flex w-full shrink-0 gap-2 md:w-auto">
                  {selectedTrip && (
                    <button
                      onClick={() => onGenerateTrip(selectedTrip._id)}
                      disabled={Boolean(saving)}
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#172126] px-4 py-3 font-semibold text-white transition hover:bg-[#263238] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
                    >
                      {isGenerating ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : selectedTrip.status === "generated" ? (
                        <RefreshCw size={18} />
                      ) : (
                        <Sparkles size={18} />
                      )}
                      {isGenerating ? "Planning..." : tripActionLabel}
                    </button>
                  )}
                </div>
              </div>

              {selectedTrip ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4">
                    <CalendarRange size={20} className="text-[#0f766e]" />
                    <p className="mt-2 text-sm text-[#66737a]">Dates</p>
                    <p className="font-semibold">
                      {formatDate(selectedTrip.startDate)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <WalletCards size={20} className="text-[#e76f51]" />
                    <p className="mt-2 text-sm text-[#66737a]">Budget</p>
                    <p className="font-semibold">
                      Rs. {selectedTrip.budget?.total || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <Hotel size={20} className="text-[#4f8f58]" />
                    <p className="mt-2 text-sm text-[#66737a]">Hotels</p>
                    <p className="font-semibold">
                      {selectedTrip.hotels?.length || 0} suggestions
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-5 rounded-2xl bg-white p-4 text-sm text-[#66737a]">
                  Select a trip or create a new one to open the planning workspace.
                </p>
              )}
            </div>

            <TripForm
              onCreateTrip={onCreateTrip}
              saving={saving === "create"}
            />
          </div>

          {selectedTrip && <TripDetail trip={selectedTrip} />}
        </section>
      </div>
    </main>
  );
}
