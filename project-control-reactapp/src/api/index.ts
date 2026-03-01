const BASE_URL = 'http://localhost:5202/project-control-api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmployeeInProjectDto {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  patronymic?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface ProjectByEmployeeDto {
  id: number;
  title?: string | null;
}

export interface GetEmployeeViewModel {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  patronymic?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  projects?: ProjectByEmployeeDto[] | null;
}

export interface GetProjectViewModel {
  id: number;
  title?: string | null;
  customerCompany?: string | null;
  performingCompany?: string | null;
  employees?: EmployeeInProjectDto[] | null;
  projectManager?: EmployeeInProjectDto | null;
  startDate: string;
  endDate?: string | null;
  priority: number;
}

export interface CreateEmployeeViewModel {
  firstName: string;
  lastName: string;
  patronymic?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  projectsIds?: number[] | null;
}

export interface UpdateEmployeeViewModel {
  firstName?: string | null;
  lastName?: string | null;
  patronymic?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  projectsIds?: number[] | null;
}

export interface CreateProjectViewModel {
  title: string;
  customerCompany: string;
  performingCompany: string;
  employeesIds?: number[] | null;
  projectManagerId?: number | null;
  startDate: string;
  finishDate?: string | null;
  priority: number;
}

export interface UpdateProjectViewModel {
  title?: string | null;
  customerCompany?: string | null;
  performingCompany?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  priority?: number | null;
}

export interface ChangeEmployeesOnProjectViewModel {
  projectManagerId?: number | null;
  employeesIds?: number[] | null;
}

export interface ChangeProjectEmployeeViewModel {
  projectsIds?: number[] | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

// ─── Employees ────────────────────────────────────────────────────────────────

export const employeesApi = {
  getAll: () => request<GetEmployeeViewModel[]>(`${BASE_URL}/employees/all`),
  getById: (id: number) => request<GetEmployeeViewModel>(`${BASE_URL}/employees/${id}`),
  create: (data: CreateEmployeeViewModel) =>
    request<CreateEmployeeViewModel>(`${BASE_URL}/employees`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: UpdateEmployeeViewModel) =>
    request<void>(`${BASE_URL}/employees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`${BASE_URL}/employees/${id}`, { method: 'DELETE' }),
  changeProjects: (id: number, data: ChangeProjectEmployeeViewModel) =>
    request<void>(`${BASE_URL}/employees/${id}/changeProjects`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsApi = {
  getAll: () => request<GetProjectViewModel[]>(`${BASE_URL}/projects/all`),
  getById: (id: number) => request<GetProjectViewModel>(`${BASE_URL}/projects/${id}`),
  create: (data: CreateProjectViewModel) =>
    request<void>(`${BASE_URL}/projects`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: UpdateProjectViewModel) =>
    request<void>(`${BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`${BASE_URL}/projects/${id}`, { method: 'DELETE' }),
  changeEmployees: (id: number, data: ChangeEmployeesOnProjectViewModel) =>
    request<void>(`${BASE_URL}/projects/${id}/change-employees`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
