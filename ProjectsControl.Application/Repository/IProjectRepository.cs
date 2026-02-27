using ProjectsControl.Entity.Models;

namespace ProjectsControl.Application.Repository;

public interface IProjectRepository : IBaseRepository<Project>
{
    Task<IReadOnlyList<Project>?> GetProjectsByEmployeeIdAsync(int employeeId);
    Task<IReadOnlyList<Project>?> GetProjectsByManagerEmployeeIdAsync(int employeeId);
    Task<IReadOnlyList<Project>?> AddProjectsToEmployeeByIdAsync(int employeeId, params int[] projectIds);
    Task<IReadOnlyList<Project>?> GetProjectsByIdAsync(params int[] projectIds);
}