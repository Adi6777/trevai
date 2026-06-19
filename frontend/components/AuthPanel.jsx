"use client";

import { useState } from "react";
import { Compass, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { authApi } from "@/lib/api";

export default function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fullName = form.fullName.trim();
      const email = form.email.trim().toLowerCase();
      const password = form.password;

      if (mode === "register" && !fullName) {
        throw new Error("Full name is required");
      }

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const payload =
        mode === "register"
          ? {
              fullName,
              email,
              password
            }
          : {
              email,
              password
            };

      const response =
        mode === "register"
          ? await authApi.register(payload)
          : await authApi.login(payload);

      window.localStorage.setItem(
        "trevai_token",
        response.data.token
      );
      onAuthenticated(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-3 sm:p-4 md:p-6">
      <section className="mx-auto grid min-h-[calc(100vh-24px)] max-w-6xl overflow-hidden rounded-2xl border border-white/70 bg-white shadow-soft sm:min-h-[calc(100vh-32px)] sm:rounded-[28px] md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between p-5 sm:p-6 md:p-10">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#0f766e] text-white sm:h-11 sm:w-11">
              <Compass size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0f766e] sm:text-sm sm:tracking-[0.18em]">
                Trevai
              </p>
              <h1 className="text-xl font-semibold leading-tight sm:text-2xl">
                Travel planning workspace
              </h1>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 w-full max-w-md space-y-4 sm:mt-10"
          >
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm text-[#66737a]">
                Build editable AI itineraries with budgets, hotels, and day-by-day plans.
              </p>
            </div>

            <div className="grid grid-cols-2 rounded-2xl bg-[#eef3ef] p-1 sm:rounded-full">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                  className={`rounded-xl px-3 py-2 text-sm font-medium sm:rounded-full sm:px-4 ${
                  mode === "login"
                    ? "bg-white text-[#172126] shadow-sm"
                    : "text-[#66737a]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                  className={`rounded-xl px-3 py-2 text-sm font-medium sm:rounded-full sm:px-4 ${
                  mode === "register"
                    ? "bg-white text-[#172126] shadow-sm"
                    : "text-[#66737a]"
                }`}
              >
                Register
              </button>
            </div>

            {mode === "register" && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Full name
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-[#d9e2df] bg-white px-3 sm:rounded-2xl">
                  <UserRound size={18} className="shrink-0 text-[#66737a]" />
                  <input
                    required={mode === "register"}
                    value={form.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    className="w-full bg-transparent py-3 outline-none"
                    placeholder="Aditya Mohite"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <div className="flex items-center gap-2 rounded-xl border border-[#d9e2df] bg-white px-3 sm:rounded-2xl">
                <Mail size={18} className="shrink-0 text-[#66737a]" />
                  <input
                  required
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  className="w-full bg-transparent py-3 outline-none"
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                Password
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-[#d9e2df] bg-white px-3 sm:rounded-2xl">
                <LockKeyhole size={18} className="shrink-0 text-[#66737a]" />
                  <input
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  className="w-full bg-transparent py-3 outline-none"
                  placeholder="Minimum 6 characters"
                  type="password"
                />
              </div>
            </label>

            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#172126] px-4 py-3 font-semibold text-white transition hover:bg-[#263238] disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-2xl"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {mode === "login" ? "Login" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-xs text-[#66737a] sm:mt-8">
            AI creates the first plan; the traveler stays in control.
          </p>
        </div>

        <div className="travel-photo hidden min-h-full items-end p-8 text-white md:flex">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/80">
              Shortlist angle
            </p>
            <p className="mt-3 max-w-sm text-3xl font-semibold leading-tight">
              Not just generated trips. Editable travel operations.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
