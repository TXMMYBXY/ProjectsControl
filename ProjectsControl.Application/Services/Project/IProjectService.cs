using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Application.Services.Project;

public interface IProjectService
{
    Task<List<GetProjectDto>> GetAllProjectsAsync();
    Task<GetProjectDto> GetProjectAsync(int projectId);
    Task CreateProjectAsync(CreateProjectDto createProjectDto);
    Task UpdateProjectAsync(int projectId, UpdateProjectDto updateProjectDto);
    Task DeleteProjectAsync(int projectId);
}