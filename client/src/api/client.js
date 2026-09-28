const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function request(path, options = {}, attempt = 0) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-demo-user": "admin",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => null);
  if (response.status === 401 && attempt === 0) return request(path, options, 1);
  if (!response.ok) {
    const message = payload?.error?.error || payload?.error || "Request failed";
    throw new ApiError(message, response.status, payload);
  }
  return payload?.data;
}