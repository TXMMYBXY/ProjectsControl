const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  getAll: () => request(`${BASE_URL}/employee`),
  getById: (id) => request(`${BASE_URL}/employee/${id}`),
  create: (data) =>
    request(`${BASE_URL}/employee`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`${BASE_URL}/employee/${id}/info`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`${BASE_URL}/employee/${id}`, { method: 'DELETE' }),
  changeProjects: (id, data) =>
    request(`${BASE_URL}/employee/${id}/projects`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const projectsApi = {
  getAll: () => request(`${BASE_URL}/project`),
  getById: (id) => request(`${BASE_URL}/project/${id}`),
  create: (data) =>
    request(`${BASE_URL}/project`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`${BASE_URL}/project/${id}/info`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`${BASE_URL}/project/${id}`, { method: 'DELETE' }),
  changeEmployees: (id, data) =>
    request(`${BASE_URL}/project/${id}/status-and-employees`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const documentsApi = {
  upload: async (projectId, file) => {
    const formData = new FormData();
    formData.append('File', file);
    const res = await fetch(`${BASE_URL}/document/${projectId}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`${res.status}: ${text}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : undefined;
  },

  getDownloadUrl: (documentId) => `${BASE_URL}/document/${documentId}/download`,

  download: async (documentId, fileName) => {
    const res = await fetch(`${BASE_URL}/document/${documentId}/download`);
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`${res.status}: ${text}`);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ?? `document_${documentId}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};
