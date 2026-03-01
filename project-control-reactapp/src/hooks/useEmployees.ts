import { useState, useEffect, useCallback } from 'react';
import { employeesApi, GetEmployeeViewModel } from '../api';

export function useEmployees() {
  const [employees, setEmployees] = useState<GetEmployeeViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeesApi.getAll();
      setEmployees(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки сотрудников');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  return { employees, loading, error, refetch: fetchEmployees };
}

export function useEmployee(id: number) {
  const [employee, setEmployee] = useState<GetEmployeeViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeesApi.getById(id);
      setEmployee(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки сотрудника');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchEmployee(); }, [fetchEmployee]);

  return { employee, loading, error, refetch: fetchEmployee };
}
