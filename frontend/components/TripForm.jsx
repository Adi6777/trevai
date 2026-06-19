"use client";

import { useState } from "react";
import { CalendarDays, Loader2, MapPin, Sparkles, UsersRound } from "lucide-react";

const initialForm = {
  destination: "",
  startDate: "",
  endDate: "",
  travelers: 2,
  preferences: "beaches, local food, nightlife"
};

export default function TripForm({ onCreateTrip, saving }) {
  const [form, setForm] = useState(initialForm);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onCreateTrip({
      ...form,
      travelers: Number(form.travelers) || 1,
      preferences: form.preferences
        .split(",")
        .map((preference) => preference.trim())
        .filter(Boolean)
    });

    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">New trip brief</h2>
          <p className="text-sm text-[#66737a]">
            Give the AI enough context to draft a useful first version.
          </p>
        </div>
        <Sparkles className="shrink-0 text-[#e76f51]" size={22} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Destination</span>
          <div className="flex items-center gap-2 rounded-xl border border-[#d9e2df] bg-white px-3">
            <MapPin size={17} className="shrink-0 text-[#66737a]" />
            <input
              required
              value={form.destination}
              onChange={(event) =>
                updateField("destination", event.target.value)
              }
              className="w-full bg-transparent py-3 outline-none"
              placeholder="Goa"
            />
          </div>
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium">Start</span>
          <div className="flex items-center gap-2 rounded-xl border border-[#d9e2df] bg-white px-3">
            <CalendarDays size={17} className="shrink-0 text-[#66737a]" />
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(event) =>
                updateField("startDate", event.target.value)
              }
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium">End</span>
          <div className="flex items-center gap-2 rounded-xl border border-[#d9e2df] bg-white px-3">
            <CalendarDays size={17} className="shrink-0 text-[#66737a]" />
            <input
              required
              type="date"
              value={form.endDate}
              onChange={(event) =>
                updateField("endDate", event.target.value)
              }
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium">Travelers</span>
          <div className="flex items-center gap-2 rounded-xl border border-[#d9e2df] bg-white px-3">
            <UsersRound size={17} className="shrink-0 text-[#66737a]" />
            <input
              min="1"
              type="number"
              value={form.travelers}
              onChange={(event) =>
                updateField("travelers", event.target.value)
              }
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium">Preferences</span>
          <input
            value={form.preferences}
            onChange={(event) =>
              updateField("preferences", event.target.value)
            }
            className="w-full rounded-xl border border-[#d9e2df] bg-white px-3 py-3 outline-none"
            placeholder="food, art, hiking"
          />
        </label>
      </div>

      <button
        disabled={saving}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 py-3 font-semibold text-white transition hover:bg-[#115e59] disabled:opacity-70"
      >
        {saving && <Loader2 size={18} className="animate-spin" />}
        Create trip
      </button>
    </form>
  );
}
