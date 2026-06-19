const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("trevai_token")
      : null;

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new Error(
      `Cannot reach the API at ${API_URL}. Make sure the backend server is running.`
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const authApi = {
  login: (payload) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  register: (payload) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  profile: () => apiRequest("/auth/profile")
};

export const tripApi = {
  list: () => apiRequest("/trips"),
  create: (payload) =>
    apiRequest("/trips", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  get: (tripId) => apiRequest(`/trips/${tripId}`),
  generate: (tripId) =>
    apiRequest(`/trips/${tripId}/generate`, {
      method: "POST"
    }),
  addActivity: (tripId, dayId, payload) =>
    apiRequest(`/trips/${tripId}/days/${dayId}/activities`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateActivity: (tripId, dayId, activityId, payload) =>
    apiRequest(`/trips/${tripId}/days/${dayId}/activities/${activityId}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  deleteActivity: (tripId, dayId, activityId) =>
    apiRequest(`/trips/${tripId}/days/${dayId}/activities/${activityId}`, {
      method: "DELETE"
    })
};
