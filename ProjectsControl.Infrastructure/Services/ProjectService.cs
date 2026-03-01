using AutoMapper;
using ProjectsControl.Application.Repository;
using ProjectsControl.Application.Services.Project;
using ProjectsControl.Application.Services.Project.Dtos;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly IMapper _mapper;
    private readonly IProjectRepository _projectRepository;
    private readonly IEmployeeRepository _employeeRepository;

    public ProjectService(
        IMapper mapper,
        IProjectRepository projectRepository,
        IEmployeeRepository employeeRepository)
    {
        _mapper = mapper;
        _projectRepository = projectRepository;
        _employeeRepository = employeeRepository;
    }

    public async Task<List<GetProjectDto>> GetAllProjectsAsync()
    {
        var projectsList = await _projectRepository.GetAllProjectsAsync();
        var projectListDto = _mapper.Map<List<GetProjectDto>>(projectsList);
        return projectListDto;
    }

    public async Task<GetProjectDto> GetProjectByIdAsync(int projectId)
    {
        var project = await _projectRepository.GetProjectByIdAsync(projectId);

        GeneralService.CheckForNull(project, "Project not found");

        var projectDto = _mapper.Map<GetProjectDto>(project);

        return projectDto;
    }

    public async Task<CreateProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto)
    {
        var project = _mapper.Map<Project>(createProjectDto);

        var employees = await _employeeRepository.GetEmployeesByIdsAsync(createProjectDto.EmployeesIds.ToArray());

        project.Employees = employees.ToList();
        
        _ValidateProjectState(project);

        await _projectRepository.AddAsync(project);
        await _projectRepository.SaveChangesAsync();

        return createProjectDto;
    }

    public async Task UpdateProjectInfoAsync(int projectId, UpdateProjectInfoDto updateProjectInfoDto)
    {
        var project = await _projectRepository.GetByIdAsync(projectId);

        GeneralService.CheckForNull(project, "Project not found");

        _mapper.Map(updateProjectInfoDto, project);

        _ValidateProjectState(project);

        await _projectRepository.SaveChangesAsync();
    }

    public async Task DeleteProjectAsync(int projectId)
    {
        var project = await _projectRepository.GetByIdAsync(projectId);

        GeneralService.CheckForNull(project, "Project not found");

        _projectRepository.Delete(project);

        await _projectRepository.SaveChangesAsync();
    }

    public async Task ChangeEmployeesOnProjectAsync(int projectId, ChangeEmployeeOnProjectDto changeEmployeeOnProjectDto)
    {
        var project = await _projectRepository.GetProjectByIdAsync(projectId);

        if (changeEmployeeOnProjectDto.ProjectManagerId.HasValue)
        {
            project.ProjectManagerId = changeEmployeeOnProjectDto.ProjectManagerId;
        }

        if (changeEmployeeOnProjectDto.EmployeesIds != null)
        {
            var employees = await _employeeRepository.GetEmployeesByIdsAsync(changeEmployeeOnProjectDto.EmployeesIds.ToArray());

            project.Employees = employees.ToList();
        }

        _ValidateProjectState(project);

        await _projectRepository.SaveChangesAsync();
    }

    /// <summary>
    /// Validate status
    /// </summary>
    /// <exception cref="InvalidOperationException"></exception>
    private void _ValidateProjectState(Project project)
    {
        if (project.Status != ProjectStatus.Backlog && project.ProjectManagerId == null)
        {
            throw new InvalidOperationException(
                $"Project with status '{project.Status}' must have a project manager assigned.");
        }

        if ((project.Status == ProjectStatus.Completed || project.Status == ProjectStatus.Archived) 
            && !project.FinishDate.HasValue)
        {
            throw new InvalidOperationException(
                $"Project with status '{project.Status}' must have a finish date.");
        }
    }
}