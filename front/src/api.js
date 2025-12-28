const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function http(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export async function fetchProjects({
  status,
  q,
  sortBy = "deadline",
  order = "asc",
} = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (sortBy) params.set("sortBy", sortBy);
  if (order) params.set("order", order);
  const query = params.toString() ? `?${params.toString()}` : "";
  return http(`/api/projects${query}`);
}

export async function createProject(data) {
  // data = { title, description, status, deadline }
  return http(`/api/projects`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(id, updates) {
  return http(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteProject(id) {
  return http(`/api/projects/${id}`, { method: "DELETE" });
}
