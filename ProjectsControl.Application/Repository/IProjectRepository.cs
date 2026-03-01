using ProjectsControl.Entity.Models;

namespace ProjectsControl.Application.Repository;

public interface IProjectRepository : IBaseRepository<Project>
{
    Task<IReadOnlyList<Project>?> GetProjectsByManagerEmployeeIdAsync(int employeeId);
    Task<IReadOnlyList<Project>?> GetProjectsByIdAsync(params int[] projectIds);
    Task<IReadOnlyList<Project>?> GetAllProjectsAsync();
    Task<Project?> GetProjectByIdAsync(int projectId);
}