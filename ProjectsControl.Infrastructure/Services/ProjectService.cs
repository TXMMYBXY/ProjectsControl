using AutoMapper;
using ProjectsControl.Application.Repository;
using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Application.Services.Project;
using ProjectsControl.Application.Services.Project.Dtos;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly IMapper  _mapper;
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
        var project = await _projectRepository.GetByIdAsync(projectId);
        
        GeneralService.CheckForNull(project, "Project not found");
        
        var projectDto = _mapper.Map<GetProjectDto>(project);
        
        return projectDto;
    }

    public async Task<CreateProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto)
    {
        var project = _mapper.Map<Project>(createProjectDto);
        var employees = await _employeeRepository.GetEmployeesByIdsAsync(createProjectDto.EmployeesIds);
        var projectManager = await _employeeRepository.GetByIdAsync(createProjectDto.ProjectManagerId);

        if (projectManager != null && !createProjectDto.EmployeesIds.Contains(projectManager.Id))
        {
            project.Employees.Add(projectManager);
            
            createProjectDto.EmployeesIds = createProjectDto.EmployeesIds
                .Append(projectManager.Id)
                .ToArray();
        }
        
        project.Employees.AddRange(employees.ToList());
        
        await _projectRepository.AddAsync(project);
        await _projectRepository.SaveChangesAsync();
        
        return createProjectDto;
    }

    public async Task UpdateProjectInfoAsync(int projectId, UpdateProjectInfoDto updateProjectInfoDto)
    {
        var employee = await _projectRepository.GetByIdAsync(projectId);
        
        _mapper.Map(updateProjectInfoDto, employee);
        
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
        var project = await _projectRepository.GetByIdAsync(projectId);

        if (changeEmployeeOnProjectDto.EmployeesIds != null)
        {
            var employees = await _employeeRepository.GetEmployeesByIdsAsync(changeEmployeeOnProjectDto.EmployeesIds);
            
            project.Employees = employees.ToList();
            
        }

        if (changeEmployeeOnProjectDto.ProjectManagerId != null)
        {
            project.ProjectManagerId = changeEmployeeOnProjectDto.ProjectManagerId.Value;
         }
        
        await _projectRepository.SaveChangesAsync();
    }
}   