using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Application.Services.Project;

public interface IProjectService
{
    Task<List<GetProjectDto>> GetAllProjectsAsync();
    Task<GetProjectDto> GetProjectByIdAsync(int projectId);
    Task<CreateProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto);
    
    /// <summary>
    /// Updating project info
    /// </summary>
    Task UpdateProjectInfoAsync(int projectId, UpdateProjectInfoDto updateProjectInfoDto);
    Task DeleteProjectAsync(int projectId);
    
    /// <summary>
    /// Updating project`s employees
    /// </summary>
    /// <param name="projectId">Id of target project</param>
    /// <param name="changeEmployeeOnProjectDto">ProjectManagerId and EmployeesIds</param>
    Task ChangeEmployeesAndStatusAsync(int projectId, ChangeEmployeeOnProjectDto changeEmployeeOnProjectDto);
}