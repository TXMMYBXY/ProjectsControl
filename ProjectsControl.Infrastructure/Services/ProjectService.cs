using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Application.Services.Project;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Infrastructure.Services;

public class ProjectService : IProjectService
{
    public async Task<List<GetProjectDto>> GetAllProjectsAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<GetProjectDto> GetProjectAsync(int projectId)
    {
        throw new NotImplementedException();
    }

    public async Task CreateProjectAsync(CreateProjectDto createProjectDto)
    {
        throw new NotImplementedException();
    }

    public async Task UpdateProjectAsync(int projectId, UpdateProjectDto updateProjectDto)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteProjectAsync(int projectId)
    {
        throw new NotImplementedException();
    }
}