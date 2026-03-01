const BASE_URL = 'http://localhost:5202/project-control-api';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : undefined;
}

export const employeesApi = {
  getAll: () => request(`${BASE_URL}/employees/all`),
  getById: (id) => request(`${BASE_URL}/employees/${id}`),
  create: (data) =>
    request(`${BASE_URL}/employees`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`${BASE_URL}/employees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`${BASE_URL}/employees/${id}`, { method: 'DELETE' }),
  changeProjects: (id, data) =>
    request(`${BASE_URL}/employees/${id}/changeProjects`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const projectsApi = {
  getAll: () => request(`${BASE_URL}/projects/all`),
  getById: (id) => request(`${BASE_URL}/projects/${id}`),
  create: (data) =>
    request(`${BASE_URL}/projects`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`${BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`${BASE_URL}/projects/${id}`, { method: 'DELETE' }),
  changeEmployees: (id, data) =>
    request(`${BASE_URL}/projects/${id}/change-employees`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
