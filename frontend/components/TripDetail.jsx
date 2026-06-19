"use client";

import { useEffect, useState } from "react";
import {
  BedDouble,
  ExternalLink,
  IndianRupee,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2
} from "lucide-react";
import { tripApi } from "@/lib/api";

const emptyActivity = {
  time: "",
  title: "",
  description: "",
  estimatedCost: "",
  location: "",
  placeDetails: "",
  mapsSearchQuery: ""
};

const getGoogleSearchUrl = (query) => {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
};

const getGoogleMapsUrl = (query) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const getGoogleMapsEmbedUrl = (query) => {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
};

export default function TripDetail({ trip }) {
  const [localTrip, setLocalTrip] = useState(trip);
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState(emptyActivity);
  const [addingDayId, setAddingDayId] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalTrip(trip);
  }, [trip]);

  const startEdit = (activity) => {
    setEditingId(activity._id);
    setDraft({
      time: activity.time || "",
      title: activity.title || "",
      description: activity.description || "",
      estimatedCost: activity.estimatedCost || "",
      location: activity.location || "",
      placeDetails: activity.placeDetails || "",
      mapsSearchQuery: activity.mapsSearchQuery || ""
    });
  };

  const updateDraft = (field, value) => {
    setDraft((current) => ({
      ...current,
      [field]: value
    }));
  };

  const saveActivity = async (dayId, activityId) => {
    setBusy(activityId || dayId);
    setError("");

    try {
      const payload = {
        ...draft,
        estimatedCost: Number(draft.estimatedCost) || 0
      };

      const response = activityId
        ? await tripApi.updateActivity(
            localTrip._id,
            dayId,
            activityId,
            payload
          )
        : await tripApi.addActivity(localTrip._id, dayId, payload);

      setLocalTrip(response.data);
      setEditingId("");
      setAddingDayId("");
      setDraft(emptyActivity);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const deleteActivity = async (dayId, activityId) => {
    setBusy(activityId);
    setError("");

    try {
      const response = await tripApi.deleteActivity(
        localTrip._id,
        dayId,
        activityId
      );
      setLocalTrip(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {localTrip.itinerary?.map((day) => (
          <article
            key={day._id}
            className="glass-panel rounded-2xl p-4 sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0f766e] sm:text-sm sm:tracking-[0.14em]">
                  Day {day.dayNumber}
                </p>
                <h3 className="break-words text-xl font-semibold sm:text-2xl">
                  {day.theme}
                </h3>
              </div>
              <button
                onClick={() => {
                  setAddingDayId(day._id);
                  setDraft(emptyActivity);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#d9e2df] bg-white px-3 py-2 text-sm font-medium sm:w-auto"
              >
                <Plus size={16} />
                Add activity
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {day.activities.map((activity) => (
                <div
                  key={activity._id}
                  className="rounded-2xl border border-[#d9e2df] bg-white p-4"
                >
                  {editingId === activity._id ? (
                    <ActivityForm
                      draft={draft}
                      busy={busy === activity._id}
                      onChange={updateDraft}
                      onCancel={() => setEditingId("")}
                      onSave={() => saveActivity(day._id, activity._id)}
                    />
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                      <div className="w-fit shrink-0 rounded-xl bg-[#f2b84b]/20 px-3 py-2 text-sm font-semibold text-[#7c5200] sm:w-24 sm:text-center">
                        {activity.time}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h4 className="break-words font-semibold">
                              {activity.title}
                            </h4>
                            <p className="mt-1 text-sm text-[#66737a]">
                              {activity.description}
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <button
                              onClick={() => startEdit(activity)}
                              title="Edit activity"
                              className="grid h-9 w-9 place-items-center rounded-xl border border-[#d9e2df]"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() =>
                                deleteActivity(day._id, activity._id)
                              }
                              title="Delete activity"
                              className="grid h-9 w-9 place-items-center rounded-xl border border-[#d9e2df] text-red-600"
                            >
                              {busy === activity._id ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="mt-3 break-words text-sm font-medium text-[#172126]">
                          {activity.location} - Rs. {activity.estimatedCost}
                        </p>
                        {activity.placeDetails && (
                          <p className="mt-1 text-sm text-[#66737a]">
                            {activity.placeDetails}
                          </p>
                        )}
                        {activity.mapsSearchQuery && (
                          <div className="mt-3 space-y-3">
                            <MapPreview query={activity.mapsSearchQuery} />
                            <a
                              href={getGoogleMapsUrl(activity.mapsSearchQuery)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-semibold text-[#0f766e]"
                            >
                              <MapPin size={14} />
                              Open map search
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {addingDayId === day._id && (
                <div className="rounded-2xl border border-[#0f766e]/30 bg-[#e6f3ef] p-4">
                  <ActivityForm
                    draft={draft}
                    busy={busy === day._id}
                    onChange={updateDraft}
                    onCancel={() => setAddingDayId("")}
                    onSave={() => saveActivity(day._id)}
                  />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <aside className="grid gap-4 md:grid-cols-2 xl:sticky xl:top-5 xl:block xl:self-start xl:space-y-4">
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <IndianRupee size={18} className="text-[#e76f51]" />
            <h3 className="font-semibold">Budget breakdown</h3>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            {Object.entries(localTrip.budget || {})
              .filter(([key]) => key !== "_id")
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between border-b border-[#d9e2df] py-2 last:border-b-0"
                >
                  <span className="capitalize text-[#66737a]">{key}</span>
                  <span className="font-semibold">Rs. {value}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <BedDouble size={18} className="text-[#4f8f58]" />
            <h3 className="font-semibold">Hotel options</h3>
          </div>
          <div className="mt-4 space-y-3">
            {localTrip.hotels?.map((hotel) => (
              <div
                key={hotel._id || hotel.name}
                className="rounded-2xl border border-[#d9e2df] bg-white p-4"
              >
                <p className="font-semibold">{hotel.name}</p>
                <p className="mt-1 text-sm text-[#66737a]">
                  {hotel.address}
                </p>
                <p className="mt-2 text-sm font-medium">
                  Rs. {hotel.pricePerNight}/night - {hotel.rating} rating
                </p>
                {hotel.area && (
                  <p className="mt-2 text-sm text-[#66737a]">
                    {hotel.area}
                    {hotel.nearbyLandmark
                      ? `, near ${hotel.nearbyLandmark}`
                      : ""}
                  </p>
                )}
                {hotel.whyRecommended && (
                  <p className="mt-2 text-sm text-[#66737a]">
                    {hotel.whyRecommended}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {hotel.confidence && (
                    <span className="rounded-full bg-[#eef3ef] px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#66737a]">
                      {hotel.confidence} confidence
                    </span>
                  )}
                  {hotel.bookingSearchQuery && (
                    <a
                      href={getGoogleSearchUrl(hotel.bookingSearchQuery)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#0f766e]"
                    >
                      Check details
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}

function ActivityForm({ draft, busy, onChange, onCancel, onSave }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <input
        value={draft.time}
        onChange={(event) => onChange("time", event.target.value)}
        className="rounded-xl border border-[#d9e2df] px-3 py-2 outline-none"
        placeholder="08:30 PM"
      />
      <input
        value={draft.location}
        onChange={(event) => onChange("location", event.target.value)}
        className="rounded-xl border border-[#d9e2df] px-3 py-2 outline-none"
        placeholder="Location"
      />
      <input
        value={draft.title}
        onChange={(event) => onChange("title", event.target.value)}
        className="rounded-xl border border-[#d9e2df] px-3 py-2 outline-none md:col-span-2"
        placeholder="Activity title"
      />
      <textarea
        value={draft.description}
        onChange={(event) => onChange("description", event.target.value)}
        className="min-h-20 rounded-xl border border-[#d9e2df] px-3 py-2 outline-none md:col-span-2"
        placeholder="Short description"
      />
      <textarea
        value={draft.placeDetails}
        onChange={(event) => onChange("placeDetails", event.target.value)}
        className="min-h-20 rounded-xl border border-[#d9e2df] px-3 py-2 outline-none md:col-span-2"
        placeholder="Place detail or local note"
      />
      <input
        value={draft.estimatedCost}
        onChange={(event) =>
          onChange("estimatedCost", event.target.value)
        }
        className="rounded-xl border border-[#d9e2df] px-3 py-2 outline-none"
        placeholder="Cost"
        type="number"
      />
      <input
        value={draft.mapsSearchQuery}
        onChange={(event) =>
          onChange("mapsSearchQuery", event.target.value)
        }
        className="rounded-xl border border-[#d9e2df] px-3 py-2 outline-none"
        placeholder="Google Maps search"
      />
      {draft.mapsSearchQuery && (
        <div className="md:col-span-2">
          <MapPreview query={draft.mapsSearchQuery} />
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onSave}
          disabled={busy}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-3 py-2 font-semibold text-white disabled:opacity-70"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#d9e2df] bg-white px-3 py-2 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function MapPreview({ query }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#d9e2df] bg-white">
      <iframe
        title={`Google Maps preview for ${query}`}
        src={getGoogleMapsEmbedUrl(query)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-52 w-full border-0 sm:h-60"
      />
    </div>
  );
}
