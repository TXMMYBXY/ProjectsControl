import { useState, useEffect, useCallback } from 'react';
import { projectsApi, GetProjectViewModel } from '../api';

export function useProjects() {
  const [projects, setProjects] = useState<GetProjectViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки проектов');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}

export function useProject(id: number) {
  const [project, setProject] = useState<GetProjectViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsApi.getById(id);
      setProject(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки проекта');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  return { project, loading, error, refetch: fetchProject };
}
