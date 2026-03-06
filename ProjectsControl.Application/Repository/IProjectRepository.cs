using ProjectsControl.Application.Services.Project;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Application.Repository;

public interface IProjectRepository : IBaseRepository<Project>
{
    /// <summary>
    /// Get all projects by Ids
    /// </summary>
    /// <param name="projectIds">Array of Ids</param>
    /// <returns>IReadOnlyList</returns>
    Task<IReadOnlyList<Project>?> GetProjectsByIdAsync(params int[] projectIds);
    
    /// <summary>
    /// Get all projects
    /// </summary>
    /// <returns>IReadOnlyList</returns>
    Task<List<Project>?> GetAllProjectsAsync(ProjectFilter projectFilter);
    
    /// <summary>
    /// Get project by Id
    /// </summary>
    Task<Project?> GetProjectByIdAsync(int projectId);
    
    /// <summary>
    /// Get all projects under management managerId
    /// </summary>
    /// <param name="employeeId">Id of manager who managed projects</param>
    /// <returns>IReadOnlyList</returns>
    Task<IReadOnlyList<Project>?> GetManagedProjectsByEmployeeIdAsync(int employeeId);
}