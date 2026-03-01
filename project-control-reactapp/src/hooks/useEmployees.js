import { useState, useEffect, useCallback } from 'react';
import { employeesApi } from '../api/index.js';

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeesApi.getAll();
      setEmployees(data ?? []);
    } catch (e) {
      setError(e.message ?? 'Ошибка загрузки сотрудников');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  return { employees, loading, error, refetch: fetchEmployees };
}
