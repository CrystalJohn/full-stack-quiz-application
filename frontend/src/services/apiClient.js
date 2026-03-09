const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      const { store } = await import("../app/store.js");
      const { logout } = await import("../features/auth/authSlice.js");
      store.dispatch(logout());
    }
    throw new Error(payload.message || "Request failed");
  }
  return payload;
};

export const apiRequest = async ({ path, method = "GET", body, token }) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseResponse(response);
};