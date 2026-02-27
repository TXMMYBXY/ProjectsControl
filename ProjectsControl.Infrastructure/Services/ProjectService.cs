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

    public ProjectService(IMapper mapper, IProjectRepository projectRepository)
    {
        _mapper = mapper;
        _projectRepository = projectRepository;
    }
    
    public async Task<List<GetProjectDto>> GetAllProjectsAsync()
    {
        var projectList = await _projectRepository.GetAllAsync();
        var projectListDto = _mapper.Map<List<GetProjectDto>>(projectList);
        
        return projectListDto;
    }

    public async Task<GetProjectDto> GetProjectByIdAsync(int projectId)
    {
        var project = await _projectRepository.GetByIdAsync(projectId);
        var projectDto = _mapper.Map<GetProjectDto>(project);
        
        return projectDto;
    }

    public async Task<CreateProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto)
    {
        var project = _mapper.Map<Project>(createProjectDto);
        
        await _projectRepository.AddAsync(project);
        await _projectRepository.SaveChangesAsync();
        
        return createProjectDto;
    }

    public async Task UpdateProjectAsync(int projectId, UpdateProjectDto updateProjectDto)
    {
        var employee = await _projectRepository.GetByIdAsync(projectId);
        
        _mapper.Map(updateProjectDto, employee);
        
        _projectRepository.UpdateFields(employee);
        
        await _projectRepository.SaveChangesAsync();
    }

    public async Task DeleteProjectAsync(int projectId)
    {
        var project = await _projectRepository.GetByIdAsync(projectId);
        
        _projectRepository.Delete(project);
        
        await _projectRepository.SaveChangesAsync();
    }
}