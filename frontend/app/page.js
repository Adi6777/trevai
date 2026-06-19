"use client";

import { useEffect, useState } from "react";
import AuthPanel from "@/components/AuthPanel";
import Dashboard from "@/components/Dashboard";
import { authApi, tripApi } from "@/lib/api";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");

  const loadTrips = async (preferredTripId) => {
    setLoading(true);
    setError("");

    try {
      const response = await tripApi.list();
      const nextTrips = response.data || [];
      setTrips(nextTrips);

      const nextSelected =
        nextTrips.find((trip) => trip._id === preferredTripId) ||
        nextTrips.find((trip) => trip._id === selectedTrip?._id) ||
        nextTrips[0] ||
        null;

      setSelectedTrip(nextSelected);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const boot = async () => {
      const token = window.localStorage.getItem("trevai_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authApi.profile();
        setUser(profile.data);
        await loadTrips();
      } catch {
        window.localStorage.removeItem("trevai_token");
      } finally {
        setLoading(false);
      }
    };

    boot();
    // The initial boot intentionally runs once; later refreshes are explicit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthenticated = async (authUser) => {
    setUser(authUser);
    await loadTrips();
  };

  const handleCreateTrip = async (payload) => {
    setSaving("create");
    setError("");

    try {
      const response = await tripApi.create(payload);
      await loadTrips(response.data._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving("");
    }
  };

  const handleSelectTrip = async (tripId) => {
    setLoading(true);
    setError("");

    try {
      const response = await tripApi.get(tripId);
      setSelectedTrip(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTrip = async (tripId) => {
    setSaving("generate");
    setError("");

    try {
      const response = await tripApi.generate(tripId);
      setSelectedTrip(response.data);
      await loadTrips(tripId);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving("");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("trevai_token");
    setUser(null);
    setTrips([]);
    setSelectedTrip(null);
  };

  if (!user) {
    return <AuthPanel onAuthenticated={handleAuthenticated} />;
  }

  return (
    <Dashboard
      user={user}
      trips={trips}
      selectedTrip={selectedTrip}
      loading={loading}
      saving={saving}
      error={error}
      onCreateTrip={handleCreateTrip}
      onSelectTrip={handleSelectTrip}
      onGenerateTrip={handleGenerateTrip}
      onLogout={handleLogout}
    />
  );
}
