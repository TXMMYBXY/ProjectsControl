import { useState, useEffect, useCallback } from 'react';
import { projectsApi } from '../api/index.js';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsApi.getAll();
      setProjects(data ?? []);
    } catch (e) {
      setError(e.message ?? 'Ошибка загрузки проектов');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}
