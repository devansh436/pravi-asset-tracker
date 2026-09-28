const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function getSelectedRole() {
  return sessionStorage.getItem("pravi.selected-role") || "viewer";
}

export function setSelectedRole(role) {
  sessionStorage.setItem("pravi.selected-role", role);
}

export function clearSelectedRole() {
  sessionStorage.removeItem("pravi.selected-role");
}

export async function request(path, options = {}) {
  const role = getSelectedRole();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Role": role,
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.error?.error ||
      payload?.error ||
      "Request failed";

    throw new ApiError(
      message,
      response.status,
      payload,
    );
  }

  return payload?.data;
}