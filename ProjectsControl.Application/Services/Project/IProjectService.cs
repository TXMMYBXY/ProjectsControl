using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Application.Services.Project;

public interface IProjectService
{
    Task<List<GetProjectDto>> GetAllProjectsAsync();
    Task<GetProjectDto> GetProjectByIdAsync(int projectId);
    Task<CreateProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto);
    Task UpdateProjectInfoAsync(int projectId, UpdateProjectInfoDto updateProjectInfoDto);
    Task DeleteProjectAsync(int projectId);
    Task ChangeEmployeesOnProjectAsync(int projectId, ChangeEmployeeOnProjectDto changeEmployeeOnProjectDto);
}